import { Module } from '@nestjs/common'
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { JwtEncrypter } from './jwt-encrypter'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { HashCompare } from '@/domain/forum/application/cryptography/hash-compare'
import { BcryptHasher } from './bcrypt-hasher'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: HashCompare, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashGenerator, HashCompare],
})
export class CryptographyModule {}
