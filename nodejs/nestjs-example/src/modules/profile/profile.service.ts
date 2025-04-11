import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateProfileRequest,
  GetProfileResponse,
} from './dto/create-profile.dto';
import { UpdateProfileRequest } from './dto/update-profile.dto';
import { PrismaService } from '@/database/prisma/prisma.service';
import { v4 as uuid } from 'uuid';
@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfileDto: CreateProfileRequest) {
    const data = {
      id: uuid(),
      userId: createProfileDto.userId,
      phone: createProfileDto.phone ?? '',
      countryCode: createProfileDto.countryCode ?? '',
      address: createProfileDto.address ?? '',
    };
    const profile = await this.prisma.profile.create({
      data: data,
    });
    return new GetProfileResponse(profile);
  }

  findAll() {
    return `This action returns all profile`;
  }

  async findOne(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        id: id,
      },
    });
    if (!profile) throw new BadRequestException('Profile not found');
    return new GetProfileResponse(profile);
  }
  async findOneByUserId(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      omit: {
        userId: true,
      },
      where: {
        userId: userId,
      },

      include: {
        user: {
          select: {
            id: true,
            localPart: true,
            domain: true,
          },
        },
      },
    });
    if (!profile) throw new BadRequestException('Profile not found');
    const user = profile.user;
    const email = `${user.localPart}@${user.domain}`;

    return new GetProfileResponse({
      ...profile,
      email,
      id: user.id,
    });
  }

  update(id: string, updateProfileDto: UpdateProfileRequest) {
    return this.prisma.profile.update({
      where: {
        id: id,
      },
      data: updateProfileDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
