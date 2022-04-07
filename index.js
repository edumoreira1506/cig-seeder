import dotEnv from 'dotenv'
import AuthBffClient from '@cig-platform/auth-bff-client'
import BackofficeBffClient from '@cig-platform/backoffice-bff-client'
import { breederFactory, poultryFactory, userFactory } from '@cig-platform/factories'
import { PoultryColorEnum, PoultryGenderCategoryEnum, PoultryGenderEnum, RegisterTypeEnum, UserRegisterTypeEnum } from '@cig-platform/enums'

dotEnv.config()

const AUTH_BFF_URL = process.env.AUTH_BFF_URL
const BACKOFFICE_BFF_URL = process.env.BACKOFFICE_BFF_URL
const PASSWORD = process.env.PASSWORD

console.info(`>>>>>>>>> STARTING SEEDING WITH PASSWORD ${PASSWORD}`)

const USERS_AMOUNT = 4;
const POULTRY_AMOUNT_PER_GENDER = 20;

const authBffClient = new AuthBffClient.default(AUTH_BFF_URL)
const backofficeBffClient = new BackofficeBffClient.default(BACKOFFICE_BFF_URL)

const randomCode = () => {
  const codeLength = 4;

  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;

  for ( var i = 0; i < codeLength; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

 return result;
}

const PoultriesFactory = async (user, breeder, token) => {
  console.log('Generating females chickens')
  await Promise.all(Array(POULTRY_AMOUNT_PER_GENDER).fill({}).map(async () => {
    const poultry = poultryFactory({
      genderCategory: PoultryGenderCategoryEnum.FemaleChicken,
      colors: {
        eyes: PoultryColorEnum.BLACK,
        plumage: PoultryColorEnum.BLACK,
        shins: PoultryColorEnum.BLACK
      }
    })

    delete poultry['active']
    delete poultry['id']
    delete poultry['number']
    delete poultry['videos']
    delete poultry['birthDate']
    delete poultry['forSale']
    delete poultry['currentAdvertisingPrice']
    delete poultry['description']

    const poultryResponseData = await backofficeBffClient.postPoultry(
      breeder.id,
      token,
      poultry,
    )

    await backofficeBffClient.postRegister(
      breeder.id,
      poultryResponseData.poultry.id,
      token,
      {
        type: RegisterTypeEnum.MeasurementAndWeighing,
        description: 'Medição de hoje!',
        metadata: { weight: 100, measurement: 150 },
        date: new Date()
      }
    )

    await backofficeBffClient.postRegister(
      breeder.id,
      poultryResponseData.poultry.id,
      token,
      {
        type: RegisterTypeEnum.Vaccination,
        description: 'Vacinação de hoje!',
        metadata: { name: 'Pfizer', dose: 1 },
        date: new Date()
      }
    )

    await backofficeBffClient.postAdvertising(
      breeder.id,
      poultryResponseData.poultry.id,
      token,
      {
        externalId: poultryResponseData.poultry.id,
        price: 15000
      }
    )

    return null
  }))

  console.log('Generating females matrixes')
  await Promise.all(Array(POULTRY_AMOUNT_PER_GENDER).fill({}).map(async () => {
    const poultry = poultryFactory({
      genderCategory: PoultryGenderCategoryEnum.Matrix,
      colors: {
        eyes: PoultryColorEnum.BLACK,
        plumage: PoultryColorEnum.BLACK,
        shins: PoultryColorEnum.BLACK
      }
    })

    delete poultry['active']
    delete poultry['id']
    delete poultry['number']
    delete poultry['videos']
    delete poultry['description']
    delete poultry['birthDate']
    delete poultry['register']
    delete poultry['forSale']
    delete poultry['currentAdvertisingPrice']

    const poultryResponseData = await backofficeBffClient.postPoultry(
      breeder.id,
      token,
      poultry,
    )

    await backofficeBffClient.postRegister(
      breeder.id,
      poultryResponseData.poultry.id,
      token,
      {
        type: RegisterTypeEnum.MeasurementAndWeighing,
        description: 'Medição de hoje!',
        metadata: { weight: 100, measurement: 150 },
        date: new Date()
      }
    )

    await backofficeBffClient.postRegister(
      breeder.id,
      poultryResponseData.poultry.id,
      token,
      {
        type: RegisterTypeEnum.Vaccination,
        description: 'Vacinação de hoje!',
        metadata: { name: 'Pfizer', dose: 1 },
        date: new Date()
      }
    )

    await backofficeBffClient.postAdvertising(
      breeder.id,
      poultryResponseData.poultry.id,
      token,
      {
        externalId: poultryResponseData.poultry.id,
        price: 15000
      }
    )

    return null
  }))

  console.log('Generating male chickens')
  await Promise.all(Array(POULTRY_AMOUNT_PER_GENDER).fill({}).map(async () => {
    const poultry = poultryFactory({
      gender: PoultryGenderEnum.Male,
      genderCategory: PoultryGenderCategoryEnum.MaleChicken,
      colors: {
        eyes: PoultryColorEnum.BLACK,
        plumage: PoultryColorEnum.BLACK,
        shins: PoultryColorEnum.BLACK
      }
    })

    delete poultry['active']
    delete poultry['id']
    delete poultry['number']
    delete poultry['videos']
    delete poultry['description']
    delete poultry['birthDate']
    delete poultry['forSale']
    delete poultry['register']
    delete poultry['currentAdvertisingPrice']

    const poultryResponseData = await backofficeBffClient.postPoultry(
      breeder.id,
      token,
      poultry,
    )

    await backofficeBffClient.postRegister(
      breeder.id,
      poultryResponseData.poultry.id,
      token,
      {
        type: RegisterTypeEnum.MeasurementAndWeighing,
        description: 'Medição de hoje!',
        metadata: { weight: 100, measurement: 150 },
        date: new Date()
      }
    )

    await backofficeBffClient.postRegister(
      breeder.id,
      poultryResponseData.poultry.id,
      token,
      {
        type: RegisterTypeEnum.Vaccination,
        description: 'Vacinação de hoje!',
        metadata: { name: 'Pfizer', dose: 1 },
        date: new Date()
      }
    )

    await backofficeBffClient.postAdvertising(
      breeder.id,
      poultryResponseData.poultry.id,
      token,
      {
        externalId: poultryResponseData.poultry.id,
        price: 15000
      }
    )

    return null
  }))

  console.log('Generating male reproductives')
  await Promise.all(Array(POULTRY_AMOUNT_PER_GENDER).fill({}).map(async () => {
    const poultry = poultryFactory({
      gender: PoultryGenderEnum.Male,
      genderCategory: PoultryGenderCategoryEnum.Reproductive,
      colors: {
        eyes: PoultryColorEnum.BLACK,
        plumage: PoultryColorEnum.BLACK,
        shins: PoultryColorEnum.BLACK
      }
    })

    delete poultry['active']
    delete poultry['id']
    delete poultry['number']
    delete poultry['forSale']
    delete poultry['videos']
    delete poultry['description']
    delete poultry['birthDate']
    delete poultry['register']
    delete poultry['currentAdvertisingPrice']

    const poultryResponseData = await backofficeBffClient.postPoultry(
      breeder.id,
      token,
      poultry,
    )

    await backofficeBffClient.postRegister(
      breeder.id,
      poultryResponseData.poultry.id,
      token,
      {
        type: RegisterTypeEnum.MeasurementAndWeighing,
        description: 'Medição de hoje!',
        metadata: { weight: 100, measurement: 150 },
        date: new Date()
      }
    )

    await backofficeBffClient.postRegister(
      breeder.id,
      poultryResponseData.poultry.id,
      token,
      {
        type: RegisterTypeEnum.Vaccination,
        description: 'Vacinação de hoje!',
        metadata: { name: 'Pfizer', dose: 1 },
        date: new Date()
      }
    )

    await backofficeBffClient.postAdvertising(
      breeder.id,
      poultryResponseData.poultry.id,
      token,
      {
        externalId: poultryResponseData.poultry.id,
        price: 15000
      }
    )

    return null
  }))
}

const UserAndBreederFactory = async () => {
  const user = userFactory({ password: PASSWORD })
  
  console.info(`Registering user with email ${user.email}`)

  const breederFromFactory = breederFactory()
  const breeder = {
    ...breederFromFactory,
    code: randomCode(),
    address: {
      ...breederFromFactory.address,
      city: 'Pereira Barreto',
      street: 'Avenida Paulista',
      zipcode: '15370-496',
      number: 1350,
      longitude: -46.6544,
      latitude: -23.5629,
    }
  }

  delete breeder['id']
  delete user['id']
  delete breeder['profileImageUrl']
  delete breeder ['active']
  delete breeder['images']
  delete breeder['createdAt']
  
  try {
    const userResponseData = await authBffClient.registerUser(
      user,
      breeder,
      UserRegisterTypeEnum.Default,
      undefined,
      '(15) 99798-6248'
    )

    console.log(`Logging as ${userResponseData.user.email}`)

    const { token } = await authBffClient.authUser(user.email, PASSWORD)

    console.log(`Token generated: ${token}`)

    console.log(`Generating poultries for breeder: ${breeder.name}`)

    await PoultriesFactory(userResponseData.user, userResponseData.breeder, token)
  } catch (error) {
    console.log(error)
    console.error('ERROR::', error)
  }
}

(async () => {
  await Promise.all(Array(USERS_AMOUNT).fill({}).map(UserAndBreederFactory))
  
  process.exit(0)
})()
