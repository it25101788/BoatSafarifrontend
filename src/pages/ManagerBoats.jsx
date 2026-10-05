import { useEffect, useState } from "react";
import {
  Plus,
  Ship,
  Users,
  Waves,
} from "lucide-react";

import api from "../services/api";
import ManagerLayout from "../layouts/ManagerLayout";
import AddBoatModal from "../components/AddBoatModal";
import EditBoatModal from "../components/EditBoatModal";
import DeleteBoatModal from "../components/DeleteBoatModal";

import "./ManagerBoats.css";


function ManagerBoats() {
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddBoat, setShowAddBoat] = useState(false);
  const [addBoatLoading, setAddBoatLoading] = useState(false);
  const [editingBoat, setEditingBoat] = useState(null);
  const [editBoatLoading, setEditBoatLoading] = useState(false);
  const [deletingBoat, setDeletingBoat] = useState(null);
  const [deleteBoatLoading, setDeleteBoatLoading] =
  useState(false);


  useEffect(() => {
    const loadBoats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/boats");

        setBoats(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Unable to load boats."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBoats();
  }, []);

  const availableBoats = boats.filter(
    (boat) => boat.status === "AVAILABLE"
  ).length;

  const totalCapacity = boats.reduce(
    (total, boat) =>
      total + Number(boat.capacity || 0),
    0
  );
  const handleAddBoat = async (boatData) => {
  try {
    setAddBoatLoading(true);
    setError("");

    const response = await api.post(
      "/boats",
      boatData
    );

    setBoats((currentBoats) => [
      ...currentBoats,
      response.data,
    ]);

    setShowAddBoat(false);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to add boat."
    );
  } finally {
    setAddBoatLoading(false);
  }
};
const handleUpdateBoat = async (boatData) => {
  if (!editingBoat) {
    return;
  }

  try {
    setEditBoatLoading(true);
    setError("");

    const response = await api.put(
      `/boats/${editingBoat.id}`,
      boatData
    );

    setBoats((currentBoats) =>
      currentBoats.map((boat) =>
        boat.id === editingBoat.id
          ? response.data
          : boat
      )
    );

    setEditingBoat(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to update boat."
    );
  } finally {
    setEditBoatLoading(false);
  }
};
const handleDeleteBoat = async () => {
  if (!deletingBoat) {
    return;
  }

  try {
    setDeleteBoatLoading(true);
    setError("");

    await api.delete(
      `/boats/${deletingBoat.id}`
    );

    setBoats((currentBoats) =>
      currentBoats.filter(
        (boat) =>
          boat.id !== deletingBoat.id
      )
    );

    setDeletingBoat(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to delete boat."
    );
  } finally {
    setDeleteBoatLoading(false);
  }
};

  return (
    <ManagerLayout>
      <div className="manager-boats-page">
        <section className="manager-boats-header">
          <div>
            <div className="manager-boats-eyebrow">
              <Waves size={15} />
              FLEET MANAGEMENT
            </div>

            <h1>Boats</h1>

            <p>
              Manage safari boats, passenger capacity
              and fleet availability.
            </p>
          </div>

         <button
  type="button"
  className="manager-add-boat-button"
  onClick={() => setShowAddBoat(true)}
>
  <Plus size={17} />
  Add boat
</button>
        </section>

        {error && (
          <div className="manager-boats-error">
            {error}
          </div>
        )}

        <section className="manager-boat-stats">
          <article className="manager-boat-stat">
            <div className="manager-boat-stat-icon">
              <Ship size={21} />
            </div>

            <div>
              <span>Total boats</span>

              <strong>
                {loading ? "—" : boats.length}
              </strong>

              <small>
                Registered fleet
              </small>
            </div>
          </article>

          <article className="manager-boat-stat">
            <div className="manager-boat-stat-icon available">
              <Waves size={21} />
            </div>

            <div>
              <span>Available</span>

              <strong>
                {loading
                  ? "—"
                  : availableBoats}
              </strong>

              <small>
                Ready for safari trips
              </small>
            </div>
          </article>

          <article className="manager-boat-stat">
            <div className="manager-boat-stat-icon capacity">
              <Users size={21} />
            </div>

            <div>
              <span>Total capacity</span>

              <strong>
                {loading
                  ? "—"
                  : totalCapacity}
              </strong>

              <small>
                Passenger seats
              </small>
            </div>
          </article>
        </section>

        {loading ? (
          <div className="manager-boats-loading">
            Loading fleet...
          </div>
        ) : boats.length === 0 ? (
          <div className="manager-boats-empty">
            <Ship size={38} />

            <h2>No boats registered</h2>

            <p>
              Add your first safari boat to start
              managing the fleet.
            </p>
          </div>
        ) : (
          <section className="manager-boats-grid">
            {boats.map((boat) => (
              <article
                className="manager-boat-card"
                key={boat.id}
              >
                <div className="manager-boat-card-top">
                  <div className="manager-boat-icon">
                    <Ship size={23} />
                  </div>

                  <span
                    className={`manager-boat-status ${boat.status.toLowerCase()}`}
                  >
                    {boat.status}
                  </span>
                </div>

                <div className="manager-boat-card-body">
                  <span>
                    BOAT #{boat.id}
                  </span>

                  <h2>
                    {boat.boatName}
                  </h2>

                  <p>
                    {boat.boatType}
                  </p>
                </div>

                <div className="manager-boat-capacity">
                  <Users size={17} />

                  <div>
                    <span>
                      Passenger capacity
                    </span>

                    <strong>
                      {boat.capacity} people
                    </strong>
                  </div>
                </div>

                <div className="manager-boat-actions">
                  <button
  type="button"
  className="manager-boat-edit"
  onClick={() => setEditingBoat(boat)}
>
  Edit
</button>

                 <button
  type="button"
  className="manager-boat-delete"
  onClick={() => setDeletingBoat(boat)}
>
  Delete
</button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
     {showAddBoat && (
  <AddBoatModal
    loading={addBoatLoading}
    onClose={() => {
      if (!addBoatLoading) {
        setShowAddBoat(false);
        setError("");
      }
    }}
    onSave={handleAddBoat}
  />
)}
{editingBoat && (
  <EditBoatModal
    boat={editingBoat}
    loading={editBoatLoading}
    onClose={() => {
      if (!editBoatLoading) {
        setEditingBoat(null);
        setError("");
      }
    }}
    onSave={handleUpdateBoat}
  />
)}
{deletingBoat && (
  <DeleteBoatModal
    boat={deletingBoat}
    loading={deleteBoatLoading}
    onClose={() => {
      if (!deleteBoatLoading) {
        setDeletingBoat(null);
        setError("");
      }
    }}
    onDelete={handleDeleteBoat}
  />
)}
    </ManagerLayout>
  );
}

export default ManagerBoats;