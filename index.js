const { Command } = require("commander");

const contactServices = require("./contacts");

const invokeAction = async ({ action, id, name, email, phone }) => {
  switch (action) {
    case "list":
      try {
        const contacts = await contactServices.listContacts();
        console.table(contacts);
      } catch (error) {
        console.error("error:", error.message);
      }

      break;

    case "get":
      try {
        const selectedElement = await contactServices.getContactById(id);
        console.log([selectedElement]);
        return selectedElement;
      } catch (error) {
        console.error("error:", error.message);
      }
      break;

    case "add":
      try {
        const newContact = { name, email, phone };
        const someVar = await contactServices.addContact(newContact);
        console.table([someVar]);
      } catch (error) {
        console.error("error:", error.message);
      }
      break;

    case "remove":
      try {
        const selectedElement = await contactServices.removeContact(id);
        console.log([selectedElement]);
        return selectedElement;
      } catch (error) {
        console.error("error:", error.message);
      }
      break;

    case "update":
      try {
        await contactServices.updateContactsId();
      } catch (error) {
        console.error("error:", error.message);
      }
      break;

    default:
      console.log("Unknown action type!");
  }
};

const program = new Command();

program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

invokeAction(argv);
