import { useEffect, useState } from 'react';
import { Check, Pencil, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', currentPassword: '', newPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) setForm((current) => ({ ...current, name: user.name || '', email: user.email || '' }));
  }, [user]);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function cancelEdit() {
    setForm({ name: user?.name || '', email: user?.email || '', currentPassword: '', newPassword: '' });
    setStatus({ type: '', message: '' });
    setEditing(false);
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setStatus({ type: '', message: '' });
    try {
      await updateProfile(form);
      setForm((current) => ({ ...current, currentPassword: '', newPassword: '' }));
      setStatus({ type: 'success', message: 'Your profile has been updated.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Unable to update your profile.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="form-page">
      <p className="kicker">ACCOUNT</p>
      <h2>Your profile</h2>
      <p className="muted">Your Donewell workspace identity.</p>
      <div className="profile-card flex items-center">
        <div className="profile-avatar">{user?.name?.slice(0, 1)}</div>
        <div>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
        </div>
        <div className='ml-auto'>
           {!editing && <button className="primary" type="button" onClick={() => setEditing(true)}><Pencil size={16} /> Edit</button>}
        </div>
      </div>
      {editing && <form className="task-form" onSubmit={submit}>
        <label>Full name<input name="name" required minLength="2" maxLength="80" value={form.name} onChange={change} /></label>
        <label>Email address<input name="email" required type="email" value={form.email} onChange={change} /></label>
        {status.message && <div className={status.type === 'success' ? 'success' : 'error'}>{status.type === 'success' && <Check size={16} />}{status.message}</div>}
        <div className="form-actions gap-2"><button className="primary" disabled={busy}>{busy ? 'Saving...' : 'Save changes'} <Save size={17} /></button><button className="secondary" type="button" onClick={cancelEdit} disabled={busy}><X size={17} /> Cancel</button></div>
      </form>}
    </section>
  );
}
