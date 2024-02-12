import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateEntryDto } from '../src/entry/dto/create-entry.dto';
import { EntryService } from '../src/entry/entry.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let entryService: EntryService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    entryService = moduleFixture.get<EntryService>(EntryService);
    await entryService.removeAll();
    await app.init();
  });

  describe('/ (GET) entry controller', () => {
    it('should get all the entries)', async () => {
      //Arrange - use service
      const mockEntry1 = new CreateEntryDto(
        2000,
        new Date(),
        'DKK',
        'luxury restaurant',
        'Dont spend money, dumbass!',
      );
      const mockEntry2 = new CreateEntryDto(
        1000,
        new Date(),
        'DKK',
        'climbing shoes',
        'Dont spend money, dumbass!',
      );

      await entryService.create(mockEntry1);
      await entryService.create(mockEntry2);

      //Act - use controller/endpoint
      const { body } = await request(app.getHttpServer())
        .get('/entry')
        //Assert
        .expect(200);
      expect(body[0].id).toBeDefined();
      expect(body[0].amount).toEqual(2000);
      expect(body[1].id).toBeDefined();
      expect(body[1].amount).toEqual(1000);
    });
  });

  describe('/ (POST) entry controller', () => {
    it('should create a new entry when passed a valid entry', async () => {
      const validEntry = new CreateEntryDto(
        100,
        new Date(),
        'DKK',
        'Pizza',
        'Dont spend money, dumbass!',
      );
      const { body } = await request(app.getHttpServer())
        .post('/entry')
        .send(validEntry)
        .expect(201);

      expect(body.amount).toEqual(100);
      expect(body.id).toBeDefined();
    });
  });

  describe('/ (PUT) entry controller', () => {
    it('should update an entry', async () => {
      //ARRANGE
      const mockEntry = new CreateEntryDto(
        500,
        new Date(),
        'DKK',
        'Restaurant',
        'Dont spend money, dumbass!',
      );

      const createdEntry = await entryService.create(mockEntry);
      const id = createdEntry.id;
      createdEntry.amount = 599;

      //ACT
      const { body } = await request(app.getHttpServer())
        .put(`/entry/${id}`)
        .send(createdEntry);
      //ASSERT
      expect(200);
      expect(body.affected).toEqual(1);
    });
  });

  // describe('/ (DELETE) entry controller', () => {
  //   it('should delete an entry', async () => {
  //     //ARRANGE
  //     const mockEntry = new CreateEntryDto(
  //       10,
  //       new Date(),
  //       'DKK',
  //       'trash can',
  //       'Dont spend money, dumbass!',
  //     );

  //     const createdEntry = await entryService.create(mockEntry);
  //     const id = createdEntry.id;
  //     console.log('deletme', createdEntry);
  //     //ACT
  //     const { body } = await request(app.getHttpServer())
  //       .delete(`/entry/${id}`)
  //       .send(createdEntry);
  //     //ASSERT
  //     expect(200);
  //     expect(body).toEqual({});
  //     console.log('body', body);
  //   });
  // });
});
