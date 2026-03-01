import type { Equipment } from '@app/item/equipment/type';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CharacterBodyDto } from './character.body.dto';
import { Character } from './character.entity';
import type { EquipmentSlotName } from './equipment/type';
import { User } from '@app/user/user.entity';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private characterRepository: Repository<Character>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createCharacter(id: string, character: CharacterBodyDto) {
    const { userId } = character;
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const characterCount = await this.characterRepository.count({
      where: { userId },
    });

    if (characterCount >= 12) {
      throw new BadRequestException('You cannot have more than 12 characters');
    }


    const newCharacter = this.characterRepository.create({
      ...character,
      userId, 
      teamId: null, 
    });

    const savedCharacter = await this.characterRepository.save(newCharacter);
    console.log('Character created successfully', savedCharacter);

    return savedCharacter;
  }

  async getAllCharacters(userId: string): Promise<Character[]> {
    try {
      return await this.characterRepository.find({
        where: { userId },
      });
    } catch (error) {
      throw new Error(
        'Error getting all characters: ' + error.message || error,
      );
    }
  }

  async getCharacterById(id: string): Promise<Character> {
    try {
      const character = await this.characterRepository.findOneBy({ id });
      if (!character) {
        throw new Error('Character not found');
      }
      return character;
    } catch (error) {
      throw new Error(
        'Error getting character by id: ' + error.message || error,
      );
    }
  }

  async addEquipments(
    characterId: string,
    equipments: Equipment[],
  ): Promise<Character> {
    const character = await this.characterRepository.findOneBy({
      id: characterId,
    });
    if (!character) {
      throw new NotFoundException('Character not found');
    }
    for (const equipment of equipments) {
      const slot = equipment.slot;
      const oldEquipment = character.equipments[slot];
      if (oldEquipment) {
        this.removeEquipmentBonuses(character, [oldEquipment]);
      }
      character.equipments[slot] = equipment;
      this.applyEquipmentBonuses(character, [equipment]);
    }
    return await this.characterRepository.save(character);
  }

  async removeEquipments(
    characterId: string,
    equipmentSlots: EquipmentSlotName[],
  ): Promise<Character> {
    const character = await this.characterRepository.findOneBy({
      id: characterId,
    });
    if (!character) {
      throw new NotFoundException('Character not found');
    }
    for (const slot of equipmentSlots) {
      const equipment = character.equipments[slot];
      if (equipment) {
        this.removeEquipmentBonuses(character, [equipment]);
      }
      character.equipments[slot] = null;
    }
    return await this.characterRepository.save(character);
  }

  private applyEquipmentBonuses(
    character: Character,
    equipments: Equipment[],
  ): void {
    for (const equipment of equipments) {
      for (const stat of equipment.statistics) {
        character.statistics[stat.name].value += stat.value;
        character.statistics[stat.name].currentValue += stat.value;
      }
    }
  }

  private removeEquipmentBonuses(
    character: Character,
    equipments: Equipment[],
  ): void {
    for (const equipment of equipments) {
      for (const stat of equipment.statistics) {
        character.statistics[stat.name].value -= stat.value;
        character.statistics[stat.name].currentValue -= stat.value;
      }
    }
  }
}
