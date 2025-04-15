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
      user_id: createProfileDto.user_id,
      phone: createProfileDto.phone ?? '',
      country_code: createProfileDto.country_code ?? '',
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
  async findOneByUserId(user_id: string) {
    const profile = await this.prisma.profile.findUnique({
      omit: {
        user_id: true,
        id: true,
      },
      where: {
        user_id: user_id,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            roles: true,
          },
        },
      },
    });
    if (!profile) throw new BadRequestException('Profile not found');
    const user = profile.user;
    return new GetProfileResponse({
      ...profile,
      ...user,
    });
  }

  async update(user_id: string, updateProfileDto: UpdateProfileRequest) {
    await this.prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        ...updateProfileDto,
        update_at: new Date(),
      },
    });
    delete updateProfileDto['email'];
    delete updateProfileDto['name'];
    await this.prisma.profile.update({
      omit: {
        id: true,
        delete_at: true,
      },
      where: {
        user_id,
      },
      data: {
        ...updateProfileDto,
        update_at: new Date(),
      },
    });
    return null;
  }

  async remove(user_id: string) {
    await this.prisma.profile.delete({
      where: {
        user_id: user_id,
      },
    });
    return null;
  }
}
