import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../mails.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

const mockMailerService = {
  sendMail: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
  getOrThrow: jest.fn(),
};

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MailerService, useValue: mockMailerService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationEmail', () => {
    const email = 'user@example.com';
    const name = 'John';
    const token = 'abc123';
    const apiUrl = 'https://api.example.com';

    beforeEach(() => {
      mockConfigService.getOrThrow.mockReturnValue(apiUrl);
    });

    describe('in production', () => {
      beforeEach(() => {
        mockConfigService.get.mockImplementation((key: string) => {
          if (key === 'NODE_ENV') return 'production';
          return undefined;
        });
      });

      it('should send email to the real recipient', async () => {
        await service.sendVerificationEmail(email, name, token);

        expect(mockMailerService.sendMail).toHaveBeenCalledWith(
          expect.objectContaining({ to: email }),
        );
      });
    });

    describe('outside production', () => {
      const testEmail = 'test@example.com';

      beforeEach(() => {
        mockConfigService.get.mockImplementation((key: string) => {
          if (key === 'NODE_ENV') return 'development';
          if (key === 'MAIL_TEST') return testEmail;
          return undefined;
        });
      });

      it('should redirect email to the test recipient', async () => {
        await service.sendVerificationEmail(email, name, token);

        expect(mockMailerService.sendMail).toHaveBeenCalledWith(
          expect.objectContaining({ to: testEmail }),
        );
      });
    });

    it('should send email with correct subject and template', async () => {
      mockConfigService.get.mockReturnValue('production');

      await service.sendVerificationEmail(email, name, token);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Account verification',
          template: 'verify-email',
        }),
      );
    });

    it('should pass name and verification url in context', async () => {
      mockConfigService.get.mockReturnValue('production');

      await service.sendVerificationEmail(email, name, token);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          context: {
            name,
            url: `${apiUrl}/verify/${token}`,
          },
        }),
      );
    });

    it('should throw if API_URL is not defined', async () => {
      mockConfigService.get.mockReturnValue('production');
      mockConfigService.getOrThrow.mockImplementation(() => {
        throw new Error('API_URL is not defined');
      });

      await expect(
        service.sendVerificationEmail(email, name, token),
      ).rejects.toThrow('API_URL is not defined');
    });

    it('should throw if mailerService fails', async () => {
      mockConfigService.get.mockReturnValue('production');
      mockMailerService.sendMail.mockRejectedValue(new Error('SMTP error'));

      await expect(
        service.sendVerificationEmail(email, name, token),
      ).rejects.toThrow('SMTP error');
    });
  });
});
