from django.core.mail import EmailMessage
from rest_framework.authtoken.models import Token

import pyotp

from ideapros_llc_linkit_33508.settings import SENDGRID_EMAIL


def send_otp(user):
    email = user.email
    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret)
    otp = totp.now()
    user.activation_key = secret
    user.otp = otp
    user.save()
    sliced_otp = str(otp)[:4]
    email_body = """\
            <html>
            <head></head>
            <body>
            <p>
            Hi,<br>
            Your OTP is %s<br>
            Regards,<br>
            Team Linkitch
            </p>
            </body>
            </html>
            """ % (sliced_otp)
    email_msg = EmailMessage("Password Reset - Linkitch", email_body, from_email=SENDGRID_EMAIL, to=[email])
    email_msg.content_subtype = "html"
    email_msg.send()

def verifyOTP(otp=None, activation_key=None, user=None):
    if otp and activation_key and user:
        totp = pyotp.TOTP(activation_key)
        sliced_otp = user.otp[:4]
        if otp == sliced_otp:
            return totp.verify(user.otp, valid_window=6)
        return False
    else:
        return False

def auth_token(user):
    token, created = Token.objects.get_or_create(user=user)
    return token
