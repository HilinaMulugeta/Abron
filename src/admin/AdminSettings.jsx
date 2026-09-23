import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function AdminSettings() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useOutletContext();
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);

  const updateField = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const handleSubmit = (event) => {
    event.preventDefault();
    updateProfile(form);
    setSaved(true);
  };

  return (
    <div className="admin-settings-page">
      <div className="admin-settings-heading">
        <div>
          <h2>Edit admin profile</h2>
          <p>Update the name and account details shown in the dashboard.</p>
        </div>
        {saved && <span className="admin-save-message">Profile saved</span>}
      </div>
      <form className="admin-settings-form" onSubmit={handleSubmit}>
        <label>
          Display name
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            required
          />
        </label>
        <label>
          Initials
          <input
            name="initials"
            value={form.initials}
            onChange={updateField}
            maxLength={3}
            required
          />
        </label>
        <label>
          Role or account label
          <input
            name="role"
            value={form.role}
            onChange={updateField}
            required
          />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            value={'admin@abron.com'}
            onChange={updateField}
            required
          />
        </label>
        <div className="admin-settings-actions">
          <button type="button" onClick={() => navigate("/admin/dashboard")}>
            Cancel
          </button>
          <button type="submit">Save profile</button>
        </div>
      </form>
    </div>
  );
}
