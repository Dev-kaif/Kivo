import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client'
import { DATABASE_URL } from "../config/env";

const connectionString = `${DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const db = new PrismaClient({ adapter })

export default db;