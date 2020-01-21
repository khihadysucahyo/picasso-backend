from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import viewsets, permissions
from django.db.models import Q
# pagination, generics
from rest_framework.decorators import (
    api_view, permission_classes)
from .models import Account
from .serializers import AccountSerializer, AccountLoginSerializer
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.response import Response
from authServer.AESEncryption import AESCipher
from authServer.settings import TOKEN_KEY
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope
from .utils import get_client_ip

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    # pagination_class = LargeResultsSetPagination
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'head']

    def get_queryset(self):
        """
        This view should return a list of all the purchases for
        the user as determined by the username portion of the URL.
        """
        # queryset = Komentar.objects.all()
        q = self.request.query_params.get('q', None)
        blank = ""
        if q is not None and q is not blank:
            self.queryset = self.queryset.filter(
                (Q(username=q))|
                (Q(email=q))|
                (Q(nama_depan__icontains=q))|
                (Q(nama_belakang__icontains=q)))
        return self.queryset

@permission_classes(
    (permissions.AllowAny,))
class AccountLogin(APIView):
    """
    Login a User
    """
    serializer_class = AccountLoginSerializer

    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = AccountLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            ip = get_client_ip(request)
            new_data = {
                            'auth_token': serializer.data["token"],
                            'key': AESCipher(TOKEN_KEY).encrypt(serializer.data["token"]),
                            'ip' : ip
                        }
            # if has_permission is not None:
            #      return Response("akun sudah digunakan", status=HTTP_400_BAD_REQUEST)
            # else:
                # email = request.data['email']

            return Response(new_data, status=HTTP_200_OK)
            # return Response(new_data, status=HTTP_200_OK, headers=headers)
        return Response(serializer.erors, status=HTTP_400_BAD_REQUEST)
