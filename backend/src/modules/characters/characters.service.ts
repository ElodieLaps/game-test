import { CharacterBodyDto } from '@characters/character.body.dto';
import { Character } from '@characters/character.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CREATION_POINTS,
  EquipmentName,
  EquipmentSlotName,
  getEquipmentByName,
} from '@shared';
import { Repository } from 'typeorm';

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
    const character = await this.characterRepository.findOneBy({ id });

    if (!character) throw new NotFoundException('Character not found');

    return character;
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

    const customStatistics = character.customStatistics;
    const totalPoints = Object.values(customStatistics).reduce(
      (a, b) => a + b,
      0,
    );

    if (totalPoints > CREATION_POINTS[character.race]) {
      throw new BadRequestException('Too many points spent');
    }

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
    equipmentNames: EquipmentName[],
  ): Promise<Character> {
    const character = await this.characterRepository.findOneBy({
      id: characterId,
      userId,
    });
    if (!character) throw new NotFoundException('Character not found');

    for (const name of equipmentNames) {
      const equipment = getEquipmentByName(name);
      const slot = equipment.slot;

      (character.equipments as Record<EquipmentSlotName, EquipmentName | null>)[
        slot
      ] = name;
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
      character.equipments[slot] = null;
    }

    return await this.characterRepository.save(character);
  }
}
