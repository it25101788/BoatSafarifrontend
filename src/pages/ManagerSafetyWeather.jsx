import { useEffect, useState } from "react";
import {
  CalendarClock,
  CloudSun,
  Plus,
  ShieldCheck,
  ShieldX,
  Thermometer,
  TriangleAlert,
  Wind,
} from "lucide-react";

import api from "../services/api";
import ManagerLayout from "../layouts/ManagerLayout";
import AddSafetyAssessmentModal from "../components/AddSafetyAssessmentModal";
import EditSafetyAssessmentModal from "../components/EditSafetyAssessmentModal";
import DeleteSafetyAssessmentModal from "../components/DeleteSafetyAssessmentModal";
import "./ManagerSafetyWeather.css";

function ManagerSafetyWeather() {
  const [records, setRecords] = useState([]);
  const [trips, setTrips] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddSafety, setShowAddSafety] =useState(false);
  const [addSafetyLoading, setAddSafetyLoading] = useState(false);
  const [editingSafety, setEditingSafety] = useState(null);
  const [editSafetyLoading, setEditSafetyLoading] =useState(false);
  const [deletingSafety, setDeletingSafety] =useState(null);
  const [deleteSafetyLoading, setDeleteSafetyLoading] =useState(false);
  useEffect(() => {
    const loadSafetyData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          recordsResponse,
          tripsResponse,
        ] = await Promise.all([
          api.get("/weather-safety"),
          api.get("/trip-schedules"),
        ]);

        setRecords(recordsResponse.data);
        setTrips(tripsResponse.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Unable to load weather and safety records."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSafetyData();
  }, []);

  const safeRecords = records.filter(
    (record) =>
      record.safetyStatus === "SAFE"
  ).length;

  const cautionRecords = records.filter(
    (record) =>
      record.safetyStatus === "CAUTION"
  ).length;

  const unsafeRecords = records.filter(
    (record) =>
      record.safetyStatus === "UNSAFE"
  ).length;

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCheckedAt = (dateTime) => {
    if (!dateTime) {
      return "Not available";
    }

    const normalizedDate = String(
      dateTime
    ).replace(
      /(\.\d{3})\d+/,
      "$1"
    );

    const date = new Date(normalizedDate);

    if (Number.isNaN(date.getTime())) {
      return String(dateTime);
    }

    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };
const handleAddSafety = async (assessmentData) => {
  try {
    setAddSafetyLoading(true);
    setError("");

    const response = await api.post(
      "/weather-safety",
      assessmentData
    );

    setRecords((currentRecords) => [
      ...currentRecords,
      response.data,
    ]);

    setShowAddSafety(false);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to add safety assessment."
    );
  } finally {
    setAddSafetyLoading(false);
  }
};
const handleUpdateSafety = async (assessmentData) => {
  if (!editingSafety) {
    return;
  }

  try {
    setEditSafetyLoading(true);
    setError("");

    const response = await api.put(
      `/weather-safety/${editingSafety.id}`,
      assessmentData
    );

    setRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.id === editingSafety.id
          ? response.data
          : record
      )
    );

    setEditingSafety(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to update safety assessment."
    );
  } finally {
    setEditSafetyLoading(false);
  }
};
const handleDeleteSafety = async () => {
  if (!deletingSafety) {
    return;
  }

  try {
    setDeleteSafetyLoading(true);
    setError("");

    await api.delete(
      `/weather-safety/${deletingSafety.id}`
    );

    setRecords((currentRecords) =>
      currentRecords.filter(
        (record) =>
          record.id !== deletingSafety.id
      )
    );

    setDeletingSafety(null);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to delete safety assessment."
    );

    setDeletingSafety(null);
  } finally {
    setDeleteSafetyLoading(false);
  }
};
  return (
    <ManagerLayout>
      <div className="manager-safety-page">
        <section className="manager-safety-header">
          <div>
            <div className="manager-safety-eyebrow">
              <CloudSun size={15} />
              SAFETY MONITORING
            </div>

            <h1>Safety & Weather</h1>

            <p>
              Monitor safari weather conditions,
              wind levels and operational safety
              assessments.
            </p>
          </div>

         <button
  type="button"
  className="manager-add-safety-button"
  onClick={() => setShowAddSafety(true)}
>
  <Plus size={17} />
  Add assessment
</button>
        </section>

        {error && (
          <div className="manager-safety-error">
            {error}
          </div>
        )}

        <section className="manager-safety-stats">
          <article className="manager-safety-stat">
            <div className="manager-safety-stat-icon">
              <CloudSun size={21} />
            </div>

            <div>
              <span>Total assessments</span>

              <strong>
                {loading
                  ? "—"
                  : records.length}
              </strong>

              <small>
                Weather checks recorded
              </small>
            </div>
          </article>

          <article className="manager-safety-stat">
            <div className="manager-safety-stat-icon safe">
              <ShieldCheck size={21} />
            </div>

            <div>
              <span>Safe</span>

              <strong>
                {loading
                  ? "—"
                  : safeRecords}
              </strong>

              <small>
                Safe for operation
              </small>
            </div>
          </article>

          <article className="manager-safety-stat">
            <div className="manager-safety-stat-icon caution">
              <TriangleAlert size={21} />
            </div>

            <div>
              <span>Caution</span>

              <strong>
                {loading
                  ? "—"
                  : cautionRecords}
              </strong>

              <small>
                Requires attention
              </small>
            </div>
          </article>

          <article className="manager-safety-stat">
            <div className="manager-safety-stat-icon unsafe">
              <ShieldX size={21} />
            </div>

            <div>
              <span>Unsafe</span>

              <strong>
                {loading
                  ? "—"
                  : unsafeRecords}
              </strong>

              <small>
                Trips should not operate
              </small>
            </div>
          </article>
        </section>

        {loading ? (
          <div className="manager-safety-loading">
            Loading safety assessments...
          </div>
        ) : records.length === 0 ? (
          <div className="manager-safety-empty">
            <CloudSun size={40} />

            <h2>No safety assessments</h2>

            <p>
              Add the first weather and safety
              assessment for a safari trip.
            </p>
          </div>
        ) : (
          <section className="manager-safety-grid">
            {records.map((record) => (
              <article
                className="manager-safety-card"
                key={record.id}
              >
                <div className="manager-safety-card-top">
                  <div>
                    <span>
                      ASSESSMENT #{record.id}
                    </span>

                    <h2>
                      {record.weatherCondition}
                    </h2>
                  </div>

                  <span
                    className={`manager-safety-status ${
                      record.safetyStatus
                        ?.toLowerCase() || ""
                    }`}
                  >
                    {record.safetyStatus}
                  </span>
                </div>

                <div className="manager-safety-trip">
                  <CalendarClock size={18} />

                  <div>
                    <span>Trip</span>

                    <strong>
                      Trip #
                      {record.tripSchedule?.id ||
                        "—"}
                    </strong>

                    <small>
                      {record.tripSchedule
                        ?.boat?.boatName || "—"}
                      {" • "}
                      {formatDate(
                        record.tripSchedule
                          ?.tripDate
                      )}
                    </small>
                  </div>
                </div>

                <div className="manager-safety-details">
                  <div>
                    <Thermometer size={18} />

                    <span>Temperature</span>

                    <strong>
                      {record.temperature}°C
                    </strong>
                  </div>

                  <div>
                    <Wind size={18} />

                    <span>Wind speed</span>

                    <strong>
                      {record.windSpeed} km/h
                    </strong>
                  </div>
                </div>

                <div className="manager-safety-notes">
                  <span>Safety notes</span>

                  <p>
                    {record.safetyNotes ||
                      "No additional safety notes."}
                  </p>
                </div>

                <div className="manager-safety-checked">
                  <span>Last checked</span>

                  <strong>
                    {formatCheckedAt(
                      record.checkedAt
                    )}
                  </strong>
                </div>

                <div className="manager-safety-actions">
                 <button
  type="button"
  className="manager-safety-edit"
  onClick={() =>
    setEditingSafety(record)
  }
>
  Edit
</button>

                  <button
  type="button"
  className="manager-safety-delete"
  onClick={() =>
    setDeletingSafety(record)
  }
>
  Delete
</button>
                </div>
              </article>
            ))}
          </section>
        )}

        <div style={{ display: "none" }}>
          {trips.length}
        </div>
      </div>
      {showAddSafety && (
  <AddSafetyAssessmentModal
    trips={trips}
    loading={addSafetyLoading}
    onClose={() => {
      if (!addSafetyLoading) {
        setShowAddSafety(false);
        setError("");
      }
    }}
    onSave={handleAddSafety}
  />
)}
{editingSafety && (
  <EditSafetyAssessmentModal
    record={editingSafety}
    trips={trips}
    loading={editSafetyLoading}
    onClose={() => {
      if (!editSafetyLoading) {
        setEditingSafety(null);
        setError("");
      }
    }}
   onSave={handleUpdateSafety}
  />
)}
{deletingSafety && (
  <DeleteSafetyAssessmentModal
    record={deletingSafety}
    loading={deleteSafetyLoading}
    onClose={() => {
      if (!deleteSafetyLoading) {
        setDeletingSafety(null);
        setError("");
      }
    }}
    onDelete={handleDeleteSafety}
  />
)}
    </ManagerLayout>
  );
}

export default ManagerSafetyWeather;