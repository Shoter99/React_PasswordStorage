import React, { useState } from "react";
import { Tooltip, Modal } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
const GridElement = ({ data, deleteItem, editItem, decrypt, check_pin }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showErrorMessage, setErrorMessage] = useState(false);
  const [copied, setCopied] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(data.name);
  const [editLogin, setEditLogin] = useState(
    decrypt(data.login) ? decrypt(data.login) : ""
  );
  const [editPass, setEditPass] = useState(
    decrypt(data.password) ? decrypt(data.password) : ""
  );
  const [editPassVisible, setEditPassVisible] = useState(false);
  const [showEditErrorMessage, setEditErrorMessage] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pinInput, setPinInput] = useState("");

  const togglePassword = (
    passwordVisible,
    setPasswordVisible,
    setErrorMessage
  ) => {
    if (check_pin(pinInput)) {
      setPinInput("");
      setPasswordVisible(!passwordVisible);
    } else {
      setPinInput("");
      setErrorMessage(true);
      setTimeout(() => {
        setErrorMessage(false);
      }, 2000);
    }
  };
  const OpenPinDialog = (passwordVisible) => {
    if (passwordVisible) {
      setPasswordVisible(false);
      return;
    }
    setShowPinDialog(true);
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      decrypt(data.password) ? decrypt(data.password) : ""
    );
    setCopied(false);
    setTimeout(() => setCopied(true), 2000);
  };

  return (
    <div className="grid-element blue-border">
      <Modal
        opened={openDelete}
        onClose={() => setOpenDelete(false)}
        title={`Are you sure you want to delete ${data.name}?`}
        classNames={{ modal: "modal-overlay" }}
      >
        <button
          className="btn"
          onClick={() => {
            setOpenDelete(false);
            deleteItem(data.id);
          }}
        >
          Delete
        </button>
      </Modal>
      <Modal
        opened={showEdit}
        title="Edit:"
        onClose={() => setShowEdit(false)}
        classNames={{ modal: "modal-overlay" }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editItem(editName, editLogin, editPass, data.id);
            setShowEdit(false);
          }}
          className="px-5 text-center"
        >
          <label className="pr-3">Name:</label>
          <br />
          <input
            required
            className="btn"
            type="text"
            value={editName}
            onChange={(event) => setEditName(event.target.value)}
          />
          <br />
          <br />
          <label className="pr-3">Login:</label>
          <br />
          <input
            required
            className="btn"
            type={editPassVisible ? "text" : "password"}
            value={editLogin}
            onChange={(event) => setEditLogin(event.target.value)}
          />
          <br />
          <br />
          <label className="pr-3">Password:</label>
          <br />
          <div className="relative">
            <input
              required
              className="btn"
              type={editPassVisible ? "text" : "password"}
              value={editPass}
              onChange={(event) => setEditPass(event.target.value)}
            />
            <Tooltip
              classNames={{
                root: "absolute bottom-14 cursor-pointer",
                body: "tooltip",
                arrow: "tooltip",
              }}
              label={editPassVisible ? "Hide" : "Show"}
              withArrow
              position="bottom"
              placement="center"
            >
              <button
                type="button"
                onClick={() => {
                  OpenPinDialog();
                }}
                id="togglePassword"
              >
                {editPassVisible ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </button>
            </Tooltip>
          </div>
          {showEditErrorMessage && (
            <div className="text-red-600">Wrong PIN</div>
          )}
          <br />
          <br />
          <div className="text-center">
            <input type="submit" className="btn" value="Save" />
          </div>
        </form>
      </Modal>
      <div className="options-wrapper">
        <div className="edit">
          <button onClick={() => setShowEdit(true)}>Edit</button>
        </div>

        <div className="delete">
          <Tooltip
            className="z"
            classNames={{ body: "tooltip", arrow: "tooltip" }}
            label="Delete Item"
            withArrow
            position="bottom"
            placement="center"
          >
            <button
              onClick={() => {
                setOpenDelete(true);
              }}
            >
              X
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="name">{data.name.slice(0, 17)}</div>
      <br />
      <div className="copypass">
        <button onClick={copyToClipboard}>
          {copied ? "Copy Password" : "Copied"}
        </button>
      </div>
      <br />
      <div className="show-details">
        <button onClick={() => OpenPinDialog()}>
          {!passwordVisible ? "Show Details" : "Hide Details"}
        </button>
      </div>
      {passwordVisible ? (
        <div>
          <br />
          <div className="data-password">
            {decrypt(data.login) ? (
              <>
                <p className="md:inline">Login: </p>
                {decrypt(data.login)}
              </>
            ) : (
              "Wrong Key"
            )}
          </div>
          <div className="data-password">
            {decrypt(data.password) ? (
              <>
                <p className="md:inline">Password: </p>
                {decrypt(data.password)}
              </>
            ) : (
              "Wrong Key"
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      {showErrorMessage && <div className="text-red-600">Wrong PIN</div>}
      {showPinDialog ? (
        <Modal
          title="Enter PIN: "
          opened={true}
          onClose={() => {
            setShowPinDialog(false);
            setPinInput("");
          }}
          withCloseButton={false}
          classNames={{ modal: "modal-overlay" }}
        >
          <div className="p-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                togglePassword(
                  passwordVisible,
                  setPasswordVisible,
                  setErrorMessage
                );
                setShowPinDialog(false);
              }}
            >
              <input
                autoFocus
                id="pinInput"
                className="btn"
                type="number"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
              />
            </form>
          </div>
        </Modal>
      ) : (
        ""
      )}
    </div>
  );
};

export default GridElement;
