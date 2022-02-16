import dotEnv from 'dotenv'
import AuthBffClient from '@cig-platform/auth-bff-client'
import BackofficeBffClient from '@cig-platform/backoffice-bff-client'
import { breederFactory, poultryFactory, userFactory } from '@cig-platform/factories'
import { PoultryColorEnum, PoultryGenderCategoryEnum, RegisterTypeEnum } from '@cig-platform/enums'

dotEnv.config()

const AUTH_BFF_URL = process.env.AUTH_BFF_URL
const BACKOFFICE_BFF_URL = process.env.BACKOFFICE_BFF_URL
const PASSWORD = process.env.PASSWORD

console.info(`>>>>>>>>> STARTING SEEDING WITH PASSWORD ${PASSWORD}`)

const USERS_AMOUNT = 1;
const POULTRY_AMOUNT_PER_GENDER = 1;

const authBffClient = new AuthBffClient.default(AUTH_BFF_URL)
const backofficeBffClient = new BackofficeBffClient.default(BACKOFFICE_BFF_URL)

const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

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
    delete poultry['description']
    delete poultry['birthDate']
    delete poultry['register']

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
        price: 150
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
  
  try {
    const userResponseData = await authBffClient.registerUser(
      user,
      breeder
    )

    console.log(`Logging as ${userResponseData.user.email}`)

    const { token } = await authBffClient.authUser(user.email, PASSWORD)

    console.log(`Token generated: ${token}`)

    console.log(`Generating poultries for breeder: ${breeder.name}`)

    await PoultriesFactory(userResponseData.user, userResponseData.breeder, token)
  } catch (error) {
    console.error('ERROR::', error)
  }
}

(async () => {
  await Promise.all(Array(USERS_AMOUNT).fill({}).map(UserAndBreederFactory))
  
  process.exit(0)
})()
