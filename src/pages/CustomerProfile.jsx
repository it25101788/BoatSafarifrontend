import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import api from "../services/api";
import CustomerLayout from "../layouts/CustomerLayout";
import EditProfileModal from "../components/EditProfileModal";

import "./CustomerProfile.css";

function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProfile, setEditingProfile] =
  useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/users/me");

        setProfile(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const getInitial = (name) => {
    if (!name) {
      return "U";
    }

    return name.charAt(0).toUpperCase();
  };
  const handleUpdateProfile = async ({
  name,
  phoneNumber,
}) => {
  if (!profile) {
    return;
  }

  try {
    setEditLoading(true);
    setError("");

    const response = await api.put(
      `/users/${profile.id}`,
      {
        name,
        phoneNumber,
        email: profile.email,
        role: profile.role,
      }
    );

    setProfile(response.data);

    const storedUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...storedUser,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
      })
    );

    setEditingProfile(false);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to update your profile."
    );
  } finally {
    setEditLoading(false);
  }
};

  return (
    <CustomerLayout>
      <div className="profile-page">
        <section className="profile-header">
          <div className="profile-eyebrow">
            <UserRound size={15} />
            MY ACCOUNT
          </div>

          <h1>Profile</h1>

          <p>
            View your personal information and account
            details.
          </p>
        </section>

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="profile-loading">
            Loading your profile...
          </div>
        ) : profile ? (
          <div className="profile-content">
            <section className="profile-identity-card">
              <div className="profile-avatar">
                {getInitial(profile.name)}
              </div>

              <div className="profile-identity">
                <span>CUSTOMER PROFILE</span>

                <h2>{profile.name}</h2>

                <p>{profile.email}</p>

                <div className="profile-role-badge">
                  <BadgeCheck size={15} />
                  {profile.role}
                </div>
              </div>
            </section>

            <section className="profile-details-card">
             <div className="profile-details-heading">
  <div>
    <span>PERSONAL INFORMATION</span>
    <h2>Account details</h2>
  </div>

  <button
    type="button"
    className="profile-edit-button"
    onClick={() =>
      setEditingProfile(true)
    }
  >
    <Pencil size={15} />
    Edit profile
  </button>
</div>

              <div className="profile-details-grid">
                <div className="profile-detail-item">
                  <div className="profile-detail-icon">
                    <UserRound size={19} />
                  </div>

                  <div>
                    <span>Full name</span>
                    <strong>
                      {profile.name || "Not available"}
                    </strong>
                  </div>
                </div>

                <div className="profile-detail-item">
                  <div className="profile-detail-icon">
                    <Mail size={19} />
                  </div>

                  <div>
                    <span>Email address</span>
                    <strong>
                      {profile.email || "Not available"}
                    </strong>
                  </div>
                </div>

                <div className="profile-detail-item">
                  <div className="profile-detail-icon">
                    <Phone size={19} />
                  </div>

                  <div>
                    <span>Phone number</span>
                    <strong>
                      {profile.phoneNumber ||
                        "Not available"}
                    </strong>
                  </div>
                </div>

                <div className="profile-detail-item">
                  <div className="profile-detail-icon">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <span>Account role</span>
                    <strong>
                      {profile.role || "CUSTOMER"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="profile-customer-id">
                Customer ID
                <strong>
                  #{profile.id}
                </strong>
              </div>
            </section>
          </div>
        ) : null}
      </div>
    {editingProfile && profile && (
  <EditProfileModal
    profile={profile}
    loading={editLoading}
    onClose={() => {
      if (!editLoading) {
        setEditingProfile(false);
        setError("");
      }
    }}
    onSave={handleUpdateProfile}
  />
)}
    </CustomerLayout>
  );
}

export default CustomerProfile;