import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import api from "../services/api";
import ManagerLayout from "../layouts/ManagerLayout";
import EditManagerUserModal from "../components/EditManagerUserModal";
import DeleteManagerUserModal from "../components/DeleteManagerUserModal";
import "./ManagerUsers.css";



function ManagerUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] =useState("");
  const [editingUser, setEditingUser] =useState(null);
  const [editUserLoading, setEditUserLoading] =useState(false);
  const [deletingUser, setDeletingUser] =useState(null);
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);
  const loggedInUser = JSON.parse(
  localStorage.getItem("user") || "{}"
);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get("/users");

        setUsers(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Unable to load users."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const customerCount = users.filter(
    (user) => user.role === "CUSTOMER"
  ).length;

  const managerCount = users.filter(
    (user) => user.role === "MANAGER"
  ).length;

  const handleUpdateUser = async (userData) => {
  if (!editingUser) {
    return;
  }

  try {
    setEditUserLoading(true);
    setError("");

    const response = await api.put(
      `/users/${editingUser.id}`,
      userData
    );

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === editingUser.id
          ? response.data
          : user
      )
    );

    setEditingUser(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to update user."
    );
  } finally {
    setEditUserLoading(false);
  }
};
const handleDeleteUser = async () => {
  if (!deletingUser) {
    return;
  }

  try {
    setDeleteUserLoading(true);
    setError("");

    await api.delete(
      `/users/${deletingUser.id}`
    );

    setUsers((currentUsers) =>
      currentUsers.filter(
        (user) =>
          user.id !== deletingUser.id
      )
    );

    setDeletingUser(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to delete user."
    );

    setDeletingUser(null);
  } finally {
    setDeleteUserLoading(false);
  }
};

  return (
    <ManagerLayout>
      <div className="manager-users-page">
        <section className="manager-users-header">
          <div>
            <div className="manager-users-eyebrow">
              <Users size={15} />
              ACCOUNT MANAGEMENT
            </div>

            <h1>Users</h1>

            <p>
              Manage customer and manager
              accounts, contact information and
              access roles.
            </p>
          </div>
        </section>

        {error && (
          <div className="manager-users-error">
            {error}
          </div>
        )}

        <section className="manager-user-stats">
          <article className="manager-user-stat">
            <div className="manager-user-stat-icon">
              <Users size={21} />
            </div>

            <div>
              <span>Total users</span>

              <strong>
                {loading
                  ? "—"
                  : users.length}
              </strong>

              <small>
                Registered accounts
              </small>
            </div>
          </article>

          <article className="manager-user-stat">
            <div className="manager-user-stat-icon customer">
              <UserRound size={21} />
            </div>

            <div>
              <span>Customers</span>

              <strong>
                {loading
                  ? "—"
                  : customerCount}
              </strong>

              <small>
                Safari customers
              </small>
            </div>
          </article>

          <article className="manager-user-stat">
            <div className="manager-user-stat-icon manager">
              <ShieldCheck size={21} />
            </div>

            <div>
              <span>Managers</span>

              <strong>
                {loading
                  ? "—"
                  : managerCount}
              </strong>

              <small>
                Management accounts
              </small>
            </div>
          </article>
        </section>

        {loading ? (
          <div className="manager-users-loading">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="manager-users-empty">
            <Users size={40} />

            <h2>No users found</h2>

            <p>
              Registered accounts will appear
              here.
            </p>
          </div>
        ) : (
          <section className="manager-users-grid">
            {users.map((user) => (
              <article
                className="manager-user-card"
                key={user.id}
              >
                <div className="manager-user-card-top">
                  <div className="manager-user-avatar">
                    {user.name
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <span
                    className={`manager-user-role ${
                      user.role
                        ?.toLowerCase() || ""
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="manager-user-identity">
                  <span>
                    USER #{user.id}
                  </span>

                  <h2>{user.name}</h2>
                </div>

                <div className="manager-user-contact">
                  <div>
                    <Mail size={17} />

                    <span>Email</span>

                    <strong>
                      {user.email || "—"}
                    </strong>
                  </div>

                  <div>
                    <Phone size={17} />

                    <span>Phone</span>

                    <strong>
                      {user.phoneNumber || "—"}
                    </strong>
                  </div>
                </div>

                <div className="manager-user-access">
                  <ShieldCheck size={17} />

                  <div>
                    <span>Access level</span>

                    <strong>
                      {user.role === "MANAGER"
                        ? "Management access"
                        : "Customer access"}
                    </strong>
                  </div>
                </div>

                <div className="manager-user-actions">
                 <button
  type="button"
  className="manager-user-edit"
  onClick={() =>
    setEditingUser(user)
  }
>
  Edit
</button>

                 <button
  type="button"
  className="manager-user-delete"
  onClick={() => setDeletingUser(user)}
  disabled={
    Number(user.id) ===
    Number(loggedInUser.id)
  }
  title={
    Number(user.id) ===
    Number(loggedInUser.id)
      ? "You cannot delete the account you are currently using."
      : "Delete user"
  }
>
  Delete
</button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      {editingUser && (
  <EditManagerUserModal
    user={editingUser}
    loading={editUserLoading}
    onClose={() => {
      if (!editUserLoading) {
        setEditingUser(null);
        setError("");
      }
    }}
   onSave={handleUpdateUser}
  />
)}
{deletingUser && (
  <DeleteManagerUserModal
    user={deletingUser}
    loading={deleteUserLoading}
    onClose={() => {
      if (!deleteUserLoading) {
        setDeletingUser(null);
        setError("");
      }
    }}
   onDelete={handleDeleteUser}
  />
)}
    </ManagerLayout>
  );
}

export default ManagerUsers;