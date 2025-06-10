import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { HOST } from "@/utils/constants"; // Ensure HOST is imported correctly

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,  
    setSelectedChatType,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    // Set chat type and data
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");

    // Update selected chat data
    if (!selectedChatData || selectedChatData._id !== contact._id) {
      setSelectedChatData(contact);
      setSelectedChatMessages([]); // Reset messages if contact changes
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt={contact.firstName || "Contact"}
                    className="object-cover w-full h-full bg-black"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/path/to/default-image.png"; // Fallback image
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gray-300">
                    <span className="text-lg font-medium text-black">
                      {contact.firstName?.[0]?.toUpperCase() || "?"}
                    </span>
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>{`${contact.firstName} ${contact.lastName}`}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
