import { Character } from '@characters/character.entity';
import { CharacterBodyDto } from '@characters/characterBodyDto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipment } from '@src/item/equipment/type';
import { Repository } from 'typeorm';
import type { EquipmentSlotName } from './equipment/types';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private characterRepository: Repository<Character>,
  ) {}

  // READING
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

      if (!character) throw new NotFoundException('Character not found');

      return character;
    } catch (error) {
      throw new Error(
        'Error getting character by id: ' + error.message || error,
      );
    }
  }

  // WRITING
  async createCharacter(
    userId: string,
    character: CharacterBodyDto,
  ): Promise<Character> {
    const characterCount = await this.characterRepository.count({
      where: { userId },
    });

    if (characterCount >= 12)
      throw new BadRequestException('You cannot have more than 12 characters');

    const newCharacter = this.characterRepository.create({
      ...character,
      userId,
      teamId: null,
    });

    return await this.characterRepository.save(newCharacter);
  }

  async deleteCharacter(userId: string, characterId: string) {
    const character = await this.characterRepository.findOneBy({
      id: characterId,
      userId,
    });

    if (!character) throw new NotFoundException('Character not found');

    await this.characterRepository.remove(character);
  }

  async addEquipments(
    userId: string,
    characterId: string,
    equipments: Equipment[],
  ): Promise<Character> {
    const character = await this.characterRepository.findOneBy({
      id: characterId,
      userId,
    });

    if (!character) throw new NotFoundException('Character not found');

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
    userId: string,
    characterId: string,
    equipmentSlots: EquipmentSlotName[],
  ): Promise<Character> {
    const character = await this.characterRepository.findOneBy({
      id: characterId,
      userId,
    });

    if (!character) throw new NotFoundException('Character not found');

    for (const slot of equipmentSlots) {
      const equipment = character.equipments[slot];

      if (equipment) {
        this.removeEquipmentBonuses(character, [equipment]);
      }

      character.equipments[slot] = null;
    }

    return await this.characterRepository.save(character);
  }

  // PRIVATE METHODS
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
