from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status, filters
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from ideapros_llc_linkit_33508.settings import SECRET_KEY

from users.models import User
from users.authentication import ExpiringTokenAuthentication
from home.permissions import IsPostOrIsAuthenticated

from home.utility import auth_token, send_otp, send_password_reset_email
from users.serializers import ChangePasswordSerializer, CustomAuthTokenSerializer, OTPSerializer, UserSerializer


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = (IsPostOrIsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = User.objects.all()
    filter_backends = [DjangoFilterBackend]

    def get_queryset(self):
        return super().get_queryset().exclude(is_superuser=True, is_staff=True)

    # Create User and return Token + Profile
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        token, created = Token.objects.get_or_create(user=serializer.instance)
        return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_201_CREATED, headers=headers) 

    # Update Profile
    def partial_update(self, request, *args, **kwargs):
        partial = True
        instance = request.user
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Send a Password Reset Link
    @action(detail=False, methods=['post'])
    def password_reset_link(self, request):
        try:
            email = request.data.get('email')
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            return Response({"detail": "Invalid Email - Does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        send_password_reset_email(user)
        return Response(status=status.HTTP_200_OK)

    # Send a OTP
    @action(detail=False, methods=['post'])
    def otp(self, request):
        try:
            email = request.data.get('email')
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            return Response({"detail": "Invalid Email - Does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        send_otp(user)
        return Response(status=status.HTTP_200_OK)

    # Verify OTP
    @action(detail=False, methods=['post'])
    def verify(self, request):
        serializer = OTPSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token = auth_token(user)
            serializer = UserSerializer(user, context={'request': request})
            return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Set password
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def password(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['password_1'])
            user.save()
            return Response({'detail': "Password Updated Successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Login a User
    @action(detail=False, methods=['post'])
    def login(self, request, **kwargs):
        serializer = CustomAuthTokenSerializer(data=request.data, context = {'request':request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token = auth_token(user)
            serializer = UserSerializer(user, context = {'request':request})
            return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Logout a Client
    @action(detail=False, methods=['get'])
    def logout(self, request):
        try:
            request.user.auth_token.delete()
        except (AttributeError, ObjectDoesNotExist):
            return Response({'detail': 'Authentication Token Missing or Invalid'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(status=status.HTTP_200_OK)

    # Admin a User
    @action(detail=False, methods=['post'])
    def admin(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        key = request.data.get('key')
        if key != SECRET_KEY:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        User.objects.create_superuser(username, email, password)
        return Response(status=status.HTTP_200_OK)
