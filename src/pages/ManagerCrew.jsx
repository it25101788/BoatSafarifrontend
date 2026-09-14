import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Car,
  Compass,
  Plus,
  UsersRound,
} from "lucide-react";

import api from "../services/api";
import ManagerLayout from "../layouts/ManagerLayout";
import AddCrewModal from "../components/AddCrewModal";
import EditCrewModal from "../components/EditCrewModal";
import DeleteCrewModal from "../components/DeleteCrewModal";

import "./ManagerCrew.css";

function ManagerCrew() {
  const [guides, setGuides] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [addCrewRole, setAddCrewRole] = useState(null);
  const [addCrewLoading, setAddCrewLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingCrew, setEditingCrew] = useState(null);
  const [editCrewLoading, setEditCrewLoading] = useState(false);
  const [deletingCrew, setDeletingCrew] = useState(null);
  const [deleteCrewLoading, setDeleteCrewLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  const loadCrew = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/guide-drivers"
      );

      const crewMembers = response.data;

      const guideList = crewMembers.filter(
        (member) =>
          member.role === "GUIDE"
      );

      const driverList = crewMembers.filter(
        (member) =>
          member.role === "DRIVER"
      );

      setGuides(guideList);
      setDrivers(driverList);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to load crew members."
      );
    } finally {
      setLoading(false);
    }
  };

  loadCrew();
}, []);

  const availableGuides = guides.filter(
    (guide) =>
      guide.availabilityStatus === "AVAILABLE"
  ).length;

  const availableDrivers = drivers.filter(
    (driver) =>
      driver.availabilityStatus === "AVAILABLE"
  ).length;

  const handleAddCrew = async (crewData) => {
  try {
    setAddCrewLoading(true);
    setError("");

    const response = await api.post(
      "/guide-drivers",
      crewData
    );

    if (response.data.role === "GUIDE") {
      setGuides((currentGuides) => [
        ...currentGuides,
        response.data,
      ]);
    }

    if (response.data.role === "DRIVER") {
      setDrivers((currentDrivers) => [
        ...currentDrivers,
        response.data,
      ]);
    }

    setAddCrewRole(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to add crew member."
    );
  } finally {
    setAddCrewLoading(false);
  }
};
const handleUpdateCrew = async (crewData) => {
  if (!editingCrew) {
    return;
  }

  try {
    setEditCrewLoading(true);
    setError("");

    const response = await api.put(
      `/guide-drivers/${editingCrew.id}`,
      crewData
    );

    if (response.data.role === "GUIDE") {
      setGuides((currentGuides) =>
        currentGuides.map((guide) =>
          guide.id === editingCrew.id
            ? response.data
            : guide
        )
      );
    }

    if (response.data.role === "DRIVER") {
      setDrivers((currentDrivers) =>
        currentDrivers.map((driver) =>
          driver.id === editingCrew.id
            ? response.data
            : driver
        )
      );
    }

    setEditingCrew(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to update crew member."
    );
  } finally {
    setEditCrewLoading(false);
  }
};
const handleDeleteCrew = async () => {
  if (!deletingCrew) {
    return;
  }

  try {
    setDeleteCrewLoading(true);
    setError("");

    await api.delete(
      `/guide-drivers/${deletingCrew.id}`
    );

    if (deletingCrew.role === "GUIDE") {
      setGuides((currentGuides) =>
        currentGuides.filter(
          (guide) =>
            guide.id !== deletingCrew.id
        )
      );
    }

    if (deletingCrew.role === "DRIVER") {
      setDrivers((currentDrivers) =>
        currentDrivers.filter(
          (driver) =>
            driver.id !== deletingCrew.id
        )
      );
    }

    setDeletingCrew(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to delete crew member."
    );
  } finally {
    setDeleteCrewLoading(false);
  }
};
  return (
    <ManagerLayout>
      <div className="manager-crew-page">
        <section className="manager-crew-header">
          <div>
            <div className="manager-crew-eyebrow">
              <UsersRound size={15} />
              CREW MANAGEMENT
            </div>

            <h1>Crew</h1>

            <p>
              Manage safari guides and drivers,
              contact information and availability.
            </p>
          </div>

          <div className="manager-crew-header-actions">
            <button
  type="button"
  className="manager-add-guide-button"
  onClick={() => setAddCrewRole("GUIDE")}
>
  <Plus size={16} />
  Add guide
</button>

           <button
  type="button"
  className="manager-add-driver-button"
  onClick={() => setAddCrewRole("DRIVER")}
>
  <Plus size={16} />
  Add driver
</button>
          </div>
        </section>

        {error && (
          <div className="manager-crew-error">
            {error}
          </div>
        )}

        <section className="manager-crew-stats">
          <article className="manager-crew-stat">
            <div className="manager-crew-stat-icon">
              <Compass size={21} />
            </div>

            <div>
              <span>Total guides</span>

              <strong>
                {loading ? "—" : guides.length}
              </strong>

              <small>
                {availableGuides} available
              </small>
            </div>
          </article>

          <article className="manager-crew-stat">
            <div className="manager-crew-stat-icon driver">
              <Car size={21} />
            </div>

            <div>
              <span>Total drivers</span>

              <strong>
                {loading ? "—" : drivers.length}
              </strong>

              <small>
                {availableDrivers} available
              </small>
            </div>
          </article>

          <article className="manager-crew-stat">
            <div className="manager-crew-stat-icon total">
              <UsersRound size={21} />
            </div>

            <div>
              <span>Total crew</span>

              <strong>
                {loading
                  ? "—"
                  : guides.length +
                    drivers.length}
              </strong>

              <small>
                Guides and drivers
              </small>
            </div>
          </article>
        </section>

        {loading ? (
          <div className="manager-crew-loading">
            Loading crew...
          </div>
        ) : (
          <div className="manager-crew-sections">
            <section className="manager-crew-section">
              <div className="manager-crew-section-heading">
                <div>
                  <span>SAFARI TEAM</span>
                  <h2>Guides</h2>
                </div>

                <Compass size={21} />
              </div>

              <div className="manager-crew-grid">
                {guides.map((guide) => (
                  <article
                    className="manager-crew-card"
                    key={guide.id}
                  >
                    <div className="manager-crew-card-top">
                      <div className="manager-crew-avatar">
                        {guide.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <span
                        className={`manager-crew-status ${guide.availabilityStatus.toLowerCase()}`}
                      >
                        {guide.availabilityStatus}
                      </span>
                    </div>

                    <div className="manager-crew-card-body">
                      <span>
                        GUIDE #{guide.id}
                      </span>

                      <h3>{guide.name}</h3>

                      <p>{guide.email}</p>
                      <p>{guide.phoneNumber}</p>
                    </div>

                    <div className="manager-crew-role">
                      <BadgeCheck size={16} />
                      GUIDE
                    </div>

                    <div className="manager-crew-actions">
                    <button
  type="button"
  className="manager-crew-edit"
  onClick={() => setEditingCrew(guide)}
>
  Edit
</button>

                    <button
  type="button"
  className="manager-crew-delete"
  onClick={() => setDeletingCrew(guide)}
>
  Delete
</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="manager-crew-section">
              <div className="manager-crew-section-heading">
                <div>
                  <span>TRANSPORT TEAM</span>
                  <h2>Drivers</h2>
                </div>

                <Car size={21} />
              </div>

              <div className="manager-crew-grid">
                {drivers.map((driver) => (
                  <article
                    className="manager-crew-card"
                    key={driver.id}
                  >
                    <div className="manager-crew-card-top">
                      <div className="manager-crew-avatar driver">
                        {driver.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <span
                        className={`manager-crew-status ${driver.availabilityStatus.toLowerCase()}`}
                      >
                        {driver.availabilityStatus}
                      </span>
                    </div>

                    <div className="manager-crew-card-body">
                      <span>
                        DRIVER #{driver.id}
                      </span>

                      <h3>{driver.name}</h3>

                      <p>{driver.email}</p>
                      <p>{driver.phoneNumber}</p>
                    </div>

                    <div className="manager-crew-role">
                      <BadgeCheck size={16} />
                      DRIVER
                    </div>

                    <div className="manager-crew-actions">
                     <button
  type="button"
  className="manager-crew-edit"
  onClick={() => setEditingCrew(driver)}
>
  Edit
</button>

                     <button
  type="button"
  className="manager-crew-delete"
  onClick={() => setDeletingCrew(driver)}
>
  Delete
</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
      {addCrewRole && (
  <AddCrewModal
    role={addCrewRole}
    loading={addCrewLoading}
    onClose={() => {
      if (!addCrewLoading) {
        setAddCrewRole(null);
        setError("");
      }
    }}
  onSave={handleAddCrew}
  />
)}
{editingCrew && (
  <EditCrewModal
    member={editingCrew}
    loading={editCrewLoading}
    onClose={() => {
      if (!editCrewLoading) {
        setEditingCrew(null);
        setError("");
      }
    }}
   onSave={handleUpdateCrew}
  />
)}
{deletingCrew && (
  <DeleteCrewModal
    member={deletingCrew}
    loading={deleteCrewLoading}
    onClose={() => {
      if (!deleteCrewLoading) {
        setDeletingCrew(null);
        setError("");
      }
    }}
   onDelete={handleDeleteCrew}
  />
)}
    </ManagerLayout>
  );
}

export default ManagerCrew;