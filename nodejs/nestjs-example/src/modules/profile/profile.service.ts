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
        id: true,
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
            name: true,
          },
        },
      },
    });
    if (!profile) throw new BadRequestException('Profile not found');
    // TODO 需要更优雅的处理邮箱
    const user = profile.user;
    const email = `${user.localPart}@${user.domain}`;
    return new GetProfileResponse({
      ...profile,
      email,
    });
  }

  async update(userId: string, updateProfileDto: UpdateProfileRequest) {
    let localPart: string | null = null,
      domain: string | null = null;
    if (updateProfileDto.email) {
      [localPart, domain] = updateProfileDto.email.split('@');
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: updateProfileDto.name,
        localPart: localPart?.toString(),
        domain: domain?.toString(),
        updateAt: new Date(),
      },
    });
    delete updateProfileDto['email'];
    delete updateProfileDto['name'];
    await this.prisma.profile.update({
      omit: {
        id: true,
        deleteAt: true,
      },
      where: {
        userId,
      },
      data: {
        ...updateProfileDto,
        updateAt: new Date(),
      },
    });
    return null;
  }

  async remove(userId: string) {
    await this.prisma.profile.update({
      where: {
        userId: userId,
      },
      data: {
        deleteAt: new Date(),
      },
    });
    return null;
  }
}
