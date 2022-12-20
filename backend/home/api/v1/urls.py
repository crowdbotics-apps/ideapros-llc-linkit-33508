from django.urls import path, include
from rest_framework.routers import DefaultRouter

from home.api.v1.viewsets import (
    SignupViewSet,
    LoginViewSet,
)
from users.viewsets import UserViewSet
from modules.terms_and_conditions.viewsets import TermAndConditionViewSet
from modules.privacy_policy.viewsets import PrivacyPolicyViewSet


router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")
router.register("users", UserViewSet, basename="users")
router.register("privacy-policy", PrivacyPolicyViewSet, basename="privacy_policy_new")
router.register("terms-and-conditions", TermAndConditionViewSet, basename="terms_and_conditions_new")

urlpatterns = [
    path("", include(router.urls)),
]
