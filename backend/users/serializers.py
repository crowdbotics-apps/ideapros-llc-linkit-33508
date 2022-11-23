from django.contrib.auth import get_user_model, authenticate

from rest_framework import serializers

from users.models import User, Litch, Kitch
from home.utility import verifyOTP


class KitchSerializer(serializers.ModelSerializer):
    """
    A data representation of the Kitch User model's Profile
    """
    class Meta:
        model = Kitch
        exclude = ('user',)


class LitchSerializer(serializers.ModelSerializer):
    """
    A data representation of the Litch User model's Profile
    """
    class Meta:
        model = Litch
        exclude = ('user',)


class UserSerializer(serializers.ModelSerializer):
    """
    Custom serializer for creating a User
    """
    litch = LitchSerializer(required=False)
    kitch = KitchSerializer(required=False)


    class Meta:
        model = get_user_model()
        fields = ('id', 'name', 'email', 'password', 'type', 'litch', 'kitch')
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5},
                        'email': {'required': True},
                        'type': {'required': True}
                        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        email = validated_data.get('email')
        validated_data['username'] = email
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        if validated_data['type'] == "Litch":
            Litch.objects.create(user=user)
        elif validated_data['type'] == "Kitch":
            Kitch.objects.create(user=user)

        return user

    def update(self, instance, validated_data):
        if 'email' in validated_data:
            email = validated_data.get('email')
            validated_data['username'] = email

        if 'litch' in validated_data:
            nested_serializer = self.fields['litch']
            nested_instance = instance.litch
            nested_data = validated_data.pop('litch')
            nested_serializer.update(nested_instance, nested_data)

        if 'kitch' in validated_data:
            nested_serializer = self.fields['kitch']
            nested_instance = instance.kitch
            nested_data = validated_data.pop('kitch')
            nested_serializer.update(nested_instance, nested_data)

        return super(UserSerializer, self).update(instance, validated_data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.type == "Litch":
            rep.pop('kitch')
        elif instance.type == "Kitch":
            rep.pop('litch')
        return rep


class OTPSerializer(serializers.Serializer):
    """
    Custom serializer to verify an OTP and Activate a User
    """
    otp = serializers.CharField(max_length=4, required=True)
    email = serializers.CharField(required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        otp = attrs.get('otp')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({'detail': 'Invalid Email'})
        else:
            if verifyOTP(otp=otp, activation_key=user.activation_key, user=user):
                user.is_active = True
                user.activation_key = ''
                user.otp = ''
                user.save()
                attrs['user'] = user
                return attrs
            else:
                raise serializers.ValidationError({'detail': 'Invalid or Expired OTP, please try again'})


class ChangePasswordSerializer(serializers.Serializer):
    """
    Custom serializer used to set the password for a User
    """
    password_1 = serializers.CharField(
        min_length=4,
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    password_2 = serializers.CharField(
        min_length=4,
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        pass1 = attrs.get('password_1')
        pass2 = attrs.get('password_2')
        if pass1 != pass2:
            raise serializers.ValidationError({'detail': 'Passwords do not match'})
        return super().validate(attrs)


class CustomAuthTokenSerializer(serializers.Serializer):
    """
    Serializer for returning an authenticated User and Token
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False, required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(
            request=self.context.get('request'),
            email=email,
            password=password
        )
        if not user:
            raise serializers.ValidationError({'detail': 'Unable to authenticate with provided credentials'})
        attrs['user'] = user
        return attrs
