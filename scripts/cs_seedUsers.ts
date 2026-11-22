// Seed demo users through BetterAuth (hashed passwords). Run: npm run seed:users
import { auth } from "@/lib/auth";
import { cs_db, cs_mongoClient } from "@/lib/cs_mongodb";

type Cs_SeedRole = "admin" | "technician" | "customer";

interface Cs_SeedUser {
  name: string;
  email: string;
  password: string;
  role: Cs_SeedRole;
  image?: string;
  phone?: string;
  area?: string;
  bio?: string;
}

const cs_photo = (cs_id: string) => `https://images.unsplash.com/${cs_id}?w=200&h=200&fit=crop&q=70`;

// Demo accounts; the same list goes in both READMEs
const CS_SEED_USERS: Cs_SeedUser[] = [
  { name: "Sumaiya Rahman", email: "admin@fixmate.test", password: "Admin@123", role: "admin", area: "Gulshan, Dhaka" },
  {
    name: "Rafiq Hasan",
    email: "rafiq@fixmate.test",
    password: "Tech@123",
    role: "technician",
    image: cs_photo("photo-1500648767791-00dcc994a43e"),
    phone: "01711000001",
    area: "Mirpur, Dhaka",
    bio: "10 years fixing smartphones and laptops. Genuine parts and a 30-day warranty on every repair.",
  },
  {
    name: "Nusrat Jahan",
    email: "nusrat@fixmate.test",
    password: "Tech@123",
    role: "technician",
    image: cs_photo("photo-1573496359142-b8d87734a5a2"),
    phone: "01711000002",
    area: "Dhanmondi, Dhaka",
    bio: "Certified AC and refrigerator technician. Gas refills, leak repairs and full servicing at your home.",
  },
  {
    name: "Tanvir Ahmed",
    email: "tanvir@fixmate.test",
    password: "Tech@123",
    role: "technician",
    image: cs_photo("photo-1507003211169-0a1dd7228f2d"),
    phone: "01711000003",
    area: "Uttara, Dhaka",
    bio: "TV, washing machine and home electrical specialist. Clear quotes before any work starts.",
  },
  {
    name: "Nadia Islam",
    email: "nadia@fixmate.test",
    password: "Customer@123",
    role: "customer",
    image: cs_photo("photo-1494790108377-be9c29b29330"),
    phone: "01811000001",
    area: "Mohammadpur, Dhaka",
  },
  {
    name: "Karim Uddin",
    email: "karim@fixmate.test",
    password: "Customer@123",
    role: "customer",
    image: cs_photo("photo-1506794778202-cad84cf45f1d"),
    phone: "01811000002",
    area: "Banani, Dhaka",
  },
  {
    name: "Farhana Akter",
    email: "farhana@fixmate.test",
    password: "Customer@123",
    role: "customer",
    image: cs_photo("photo-1438761681033-6461ffad8d80"),
    phone: "01811000003",
    area: "Bashundhara, Dhaka",
  },
];

// Host only, never the username or password
const cs_describeTarget = () => {
  const cs_uri = process.env.CS_MONGODB_URI ?? "";
  const cs_host = cs_uri.replace(/^mongodb(\+srv)?:\/\//, "").split("@").pop()?.split("/")[0]?.split("?")[0] ?? "unknown";
  return `${cs_db.databaseName} @ ${cs_host}`;
};

const cs_seedUsers = async () => {
  console.log(`Seeding users into ${cs_describeTarget()}`);
  const cs_users = cs_db.collection("user");

  for (const cs_seed of CS_SEED_USERS) {
    const { name: cs_name, email: cs_email, password: cs_password, role: cs_role, ...cs_profile } = cs_seed;
    const cs_existing = await cs_users.findOne({ email: cs_email });

    if (!cs_existing) {
      // Sign-up only allows customer/technician; admin is promoted below
      await auth.api.signUpEmail({
        body: { name: cs_name, email: cs_email, password: cs_password, role: cs_role === "admin" ? "customer" : cs_role },
      });
    }

    // Role and profile fields are not sign-up inputs, so set them directly
    await cs_users.updateOne(
      { email: cs_email },
      { $set: { role: cs_role, emailVerified: true, ...cs_profile, updatedAt: new Date() } },
    );
    console.log(`${cs_existing ? "updated" : "created"}  ${cs_role.padEnd(10)} ${cs_email}`);
  }
};

cs_seedUsers()
  .then(() => console.log("Done."))
  .catch((cs_error) => {
    console.error("Seeding failed:", cs_error instanceof Error ? cs_error.message : cs_error);
    process.exitCode = 1;
  })
  .finally(() => cs_mongoClient.close());
