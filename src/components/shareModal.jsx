import React, { useState } from "react";
import Modal from "react-modal";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  RedditShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
  RedditIcon,
  LinkedinIcon,
} from "react-share";
import { MdClose, MdContentCopy } from "react-icons/md";

Modal.setAppElement("#root"); // For accessibility

const ShareModal = ({ isOpen, onClose, shareUrl }) => {
  const [isCopied, setIsCopied] = useState(false);

  // Function to copy link
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded-lg max-w-md mx-auto shadow-lg"
      overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Share post</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          <MdClose size={24} />
        </button>
      </div>

      {/* Share Options */}
      <div className="grid grid-cols-4 gap-4 justify-items-center mb-4">
        <TwitterShareButton url={shareUrl}>
          <TwitterIcon size={48} round />
          <p className="text-xs mt-1 text-center">Twitter</p>
        </TwitterShareButton>

        <FacebookShareButton url={shareUrl}>
          <FacebookIcon size={48} round />
          <p className="text-xs mt-1 text-center">Facebook</p>
        </FacebookShareButton>

        <RedditShareButton url={shareUrl}>
          <RedditIcon size={48} round />
          <p className="text-xs mt-1 text-center">Reddit</p>
        </RedditShareButton>

        <TelegramShareButton url={shareUrl}>
          <TelegramIcon size={48} round />
          <p className="text-xs mt-1 text-center">Telegram</p>
        </TelegramShareButton>

        <WhatsappShareButton url={shareUrl}>
          <WhatsappIcon size={48} round />
          <p className="text-xs mt-1 text-center">WhatsApp</p>
        </WhatsappShareButton>

        <LinkedinShareButton url={shareUrl}>
          <LinkedinIcon size={48} round />
          <p className="text-xs mt-1 text-center">LinkedIn</p>
        </LinkedinShareButton>

        {/* Placeholder for additional options */}
        <button className="flex flex-col items-center">
          <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center">
            <p className="font-bold text-gray-500">+</p>
          </div>
          <p className="text-xs mt-1 text-center">More</p>
        </button>
      </div>

      {/* Page Link with Copy Option */}
      <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="bg-gray-100 w-full outline-none text-gray-700"
        />
        <button
          onClick={handleCopy}
          className="ml-2 text-blue-500 hover:text-blue-700"
        >
          {isCopied ? "Copied!" : <MdContentCopy size={20} />}
        </button>
      </div>
    </Modal>
  );
};

export default ShareModal;
