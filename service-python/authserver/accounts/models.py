# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from dateutil.relativedelta import relativedelta
from django.contrib.postgres.indexes import GinIndex
import django.contrib.postgres.search as pg_search

from master.models import JenisNomorIdentitas, MetaAtribut

from datetime import datetime, date

from django.contrib.auth.models import (
	BaseUserManager, AbstractBaseUser
)

from django.contrib.auth.models import PermissionsMixin

import os, re, uuid

class AccountManager(BaseUserManager):
	def create_user(self, email, username, first_name=None, last_name=None, photo=None, password=None):
		"""
			Creates and saves a User with the given email, date of
			birth and password.
		"""

		if not username:
			raise ValueError('Users must have an username address')

		user = self.model(
			email=email,
			username=username,
			first_name=first_name,
			last_name=last_name,
		)

		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, username, password):
		"""
		Creates and saves a superuser with the given email, date of
		birth and password.
		"""
		user = self.create_user(
			email,
			username,
			password=password
		)
		user.is_superuser = True
		user.is_admin = True
		user.save(using=self._db)
		return user


class Account(AbstractBaseUser,PermissionsMixin, MetaAtribut):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4)
	email = models.EmailField(unique=True, blank=True, null=True)
	username = models.CharField(max_length=40, unique=True, db_index=True)
	firstName = models.CharField("Nama Depan", max_length=100, null=True, blank=True, db_index=True)
	lastName = models.CharField("Nama Belakang", max_length=100, null=True, blank=True, db_index=True)

	birthPlace = models.CharField(max_length=30, verbose_name='Tempat Lahir', null=True, blank=True)
	birthDate = models.DateField(verbose_name='Tanggal Lahir', null=True, blank=True)
	telephone = models.CharField(verbose_name='Telepon', max_length=50, null=True, blank=True)

	idDivisi = models.CharField(verbose_name='ID Divisi', max_length=40, null=True, blank=True)
	divisi = models.CharField(verbose_name='Divisi', max_length=50, null=True, blank=True)
	idJabatan = models.CharField(verbose_name='ID Jabatan', max_length=40, null=True, blank=True)
	jabatan = models.CharField(verbose_name='Jabatan', max_length=50, null=True, blank=True)

	maritalStatus = models.CharField(verbose_name='Status Pernikahan', max_length=50, null=True, blank=True)
	numberChildren = models.CharField(verbose_name='Jumlah Anak', max_length=50, null=True, blank=True)
	religion = models.CharField(verbose_name='Agama', max_length=50, null=True, blank=True)
	bloodType = models.CharField(verbose_name='Golongan Darah', max_length=50, null=True, blank=True)
	gender = models.CharField(verbose_name='Jenis Kelamin', max_length=50, null=True, blank=True)

	idProvince = models.CharField(verbose_name="ID Provinsi", max_length=40, null=True, blank=True)
	province = models.CharField(verbose_name="Provinsi", max_length=80, null=True, blank=True)
	idDistricts = models.CharField(verbose_name="ID Kabupaten", max_length=40, null=True, blank=True)
	districts = models.CharField(verbose_name="Kabupaten", max_length=100, null=True, blank=True)
	idSubDistrict = models.CharField(verbose_name="ID Kecamatan", max_length=40, null=True, blank=True)
	subDistrict = models.CharField(verbose_name="Kecamatan", max_length=100, null=True, blank=True)
	idVillage = models.CharField(verbose_name="ID Desa", max_length=40, null=True, blank=True)
	village = models.CharField(verbose_name="Desa", max_length=150, null=True, blank=True)

	address = models.CharField(verbose_name="Alamat", max_length=255, null=True, blank=True)

	lt = models.CharField(max_length=50, verbose_name='lt', blank=True, null=True)
	lg = models.CharField(max_length=50, verbose_name='lg', blank=True, null=True)

	photo = models.CharField(verbose_name="Foto", max_length=150, null=True, blank=True)
	sv = pg_search.SearchVectorField(null=True, blank=True)

	is_active = models.BooleanField(default=True)
	is_admin = models.BooleanField(default=False)

	objects = AccountManager()

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email',]

	def get_complete_location_dictionary(self):
		province = ''
		districts = ''
		subDistrict = ''
		village = ''
		idProvince = ''
		idDistricts = ''
		idSubDistrict= ''
		idVillage = ''
		if self.desa:
			return self.desa.get_complete_location_dictionary()
		return dict(
			province=province,
			idProvince=idProvince,
			districts=districts,
			idDistricts=idDistricts,
			subDistrict=subDistrict,
			idSubDistrict=idSubDistrict,
			village=village,
			idVillage=idVillage
		)

	# @property
	def get_years_birthday(self):
		years = "-"
		if self.birthDate:
			rdelta = relativedelta(date.today(), self.birthDate)
			years = rdelta.years
			return years
		return years

	def get_month_birthday(self):
		months = "-"
		if self.birthDate:
			rdelta = relativedelta(date.today(), self.birthDate)
			months = rdelta.months
			return months
		return months

	def get_day_birthday(self):
		days = "-"
		if self.birthDate:
			rdelta = relativedelta(date.today(), self.birthDate)
			days = rdelta.days
			return days
		return days

	def is_staff(self):
		"Allow All Member to Login"
		# Simplest possible answer: All admins are staff

		return self.is_active

	def get_full_name(self):
		# The user is identified by their nama
		if self.firstName:
			return self.firstName +' '+ self.lastName
		else:
			return ''

	def get_alamat(self):
		a = "-"
		if self.address:
			a = self.address
		if self.desa:
			a = a+" "+self.desa.alamat_lengkap()
		return a

	def __str__(self):
		return u'%s' % (self.email)

	class Meta:
		indexes = [GinIndex(fields=['sv'])]
		ordering = ['id']
		verbose_name = 'Akun'
		verbose_name_plural = 'Akun'

class NomorIdentitasPengguna(models.Model):
	number = models.CharField(max_length=100, unique=True, db_index=True)
	user = models.ForeignKey(Account, on_delete=models.CASCADE, verbose_name='User')
	typeIdentity = models.ForeignKey(JenisNomorIdentitas, on_delete=models.CASCADE, verbose_name='Jenis Nomor Identitas')

	def set_as_username(self):
		self.user.username = re.sub('[^0-9a-zA-Z]+', '', self.nomor)
		self.user.save()

	def __unicode__(self):
		return u'%s' % (self.nomor)

	class Meta:
		verbose_name = 'Nomor Identitas Pengguna'
		verbose_name_plural = 'Nomor Identitas Pengguna'

class AccountHistoryAction(models.Model):
	action = models.CharField(max_length=100)
	user = models.ForeignKey(Account, on_delete=models.CASCADE, verbose_name='User')
	information = models.CharField(max_length=255, blank=True, null=True)

	createdAt = models.DateTimeField(editable=False)
	updatedAt = models.DateTimeField(auto_now=True)

	def save(self, *args, **kwargs):
		''' On save, update timestamps '''
		if not self.id:
			self.created_at = datetime.now()
		self.updated_at = datetime.now()
		return super(AccountHistoryAction, self).save(*args, **kwargs)

	def __unicode__(self):
		return u'%s' % (self.action)

	class Meta:
		verbose_name = 'Riwayat Aksi Pengguna'
		verbose_name_plural = 'Riwayat Aksi Pengguna'
