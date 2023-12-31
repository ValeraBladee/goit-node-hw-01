const { randomUUID } = require("node:crypto");

const fs = require("node:fs/promises");
const path = require("node:path");
const contactsDataPath = path.join(__dirname, "db/", "contacts.json");

console.log("\nPROGRAM START\n");

const listContacts = async () => {
  try {
    // get json contacts
    const data = await fs.readFile(contactsDataPath, { encoding: "utf-8" });

    // return parsed contacts
    return JSON.parse(data);
  } catch (error) {
    console.error("error:", error.message);
  }
};

const writeContacts = async (contacts) => {
  try {
    // JSON.stringify data and write to contacts.json
    await fs.writeFile(
      contactsDataPath,
      JSON.stringify(contacts, undefined, 2)
    );
  } catch (error) {
    console.error("error:", error.message);
  }
};

const getContactById = async (contactId) => {
  try {
    // get contacts list
    const contactsData = await listContacts();

    // looking for contact with id === contactId
    const foundContact = contactsData.find(
      (contact) => contact.id === contactId
    );

    // is contact found, return contact, else return null
    return foundContact ?? null;
  } catch (error) {
    console.error("error:", error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    // get contacts list
    const contactsData = await listContacts();

    // looking for contact with id === contactId
    const removeIndex = contactsData.findIndex((item) => item.id === contactId);

    // if removeIndex === -1, return null, else return contact with id === contactId
    if (removeIndex === -1) {
      console.log("contact not found");
      return null;
    }

    // create new array without element with index removeIndex
    const newContactsData = [
      ...contactsData.slice(0, removeIndex),
      ...contactsData.slice(removeIndex + 1),
    ];

    // write new array to contacts.json
    await writeContacts(newContactsData);

    return contactsData[removeIndex];
  } catch (error) {
    console.error("error:", error.message);
  }
};

const addContact = async ({ name = "", email = "", phone = "" }) => {
  const checkDublicateName = (name, data) =>
    data.find(
      (item) => item.name.toLowerCase().trim() === name.toLowerCase().trim()
    );

  try {
    name = name.trim();
    email = email.trim();
    phone = phone.trim();

    if (!name | !email | !phone) {
      console.log("name, email, phone must be filled");
      return null;
    }

    // get contacts list
    const contactsData = await listContacts();

    // check is name dublicated
    const checkName = checkDublicateName(name, contactsData);

    if (checkName) {
      console.log("dublicate name");
      return { name, email, phone };
    }

    const newContact = { name, email, phone, id: randomUUID() };

    // create new array with new contact
    const newContactsData = [newContact, ...contactsData];

    // write new array to contacts.json
    await writeContacts(newContactsData);

    console.log("success: add contact");

    return newContact;
  } catch (error) {
    console.error("error:", error.message);
  }
};

const updateContactsId = async () => {
  try {
    // get contacts
    const contacts = await listContacts();
    console.table(contacts);

    // update id in contacts
    const updatedContacts = contacts.map((contact) => ({
      ...contact,
      id: randomUUID(),
    }));

    console.table(updatedContacts);

    // write contacts with new id
    await writeContacts(updatedContacts);
  } catch (error) {
    console.error("error:", error.message);
  }
};

module.exports = {
  listContacts,
  writeContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactsId,
};
