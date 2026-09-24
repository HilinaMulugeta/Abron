import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import MobileAppShell from "../components/MobileAppShell";

export default function DeliveryPartner() {
  const [form, setForm] = useState({ name: "", phone: "", area: "Bole", vehicle: "Motorcycle", plate: "", experience: "" });
  const [submitted, setSubmitted] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    const applications = JSON.parse(localStorage.getItem("abron_driver_applications") || "[]");
    if (applications.some((application) => application.phone === form.phone.trim())) {
      toast.error("An application with this phone number already exists.");
      return;
    }
    const application = { ...form, name: form.name.trim(), phone: form.phone.trim(), status: "Pending review", submittedAt: new Date().toISOString() };
    localStorage.setItem("abron_driver_applications", JSON.stringify([application, ...applications]));
    setSubmitted(true);
    toast.success("Your delivery partner application has been submitted.");
  };

  return <MobileAppShell><section className="mx-auto max-w-2xl px-4 py-10">
    <Link to="/" className="text-sm font-semibold text-green-800">← Back to Abron</Link>
    <div className="mt-5 rounded-3xl border border-[#eadfc8] bg-[#fffaf4] p-6 shadow-sm sm:p-9">
      <p className="text-xs font-bold uppercase tracking-widest text-[#d56a2b]">Drive with Abron</p>
      <h1 className="mt-2 text-3xl font-black text-[#1f2f27]">Become a delivery partner</h1>
      <p className="mt-2 text-sm text-[#5d6f67]">Tell us how to reach you and where you’d like to deliver. Our team will review your application.</p>
      {submitted ? <div className="mt-8 rounded-2xl bg-green-50 p-5 text-green-900"><h2 className="font-bold">Application received</h2><p className="mt-1 text-sm">Your application is saved as pending review. We’ll contact you using the phone number you provided.</p><button className="mt-4 text-sm font-bold underline" onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", area: "Bole", vehicle: "Motorcycle", plate: "", experience: "" }); }}>Submit another application</button></div> : <form onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-gray-700">Full name<input required minLength={3} name="name" value={form.name} onChange={update} className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5" placeholder="Your name" /></label>
        <label className="text-sm font-semibold text-gray-700">Phone number<input required type="tel" name="phone" value={form.phone} onChange={update} className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5" placeholder="+251 9..." /></label>
        <label className="text-sm font-semibold text-gray-700">Preferred delivery area<select name="area" value={form.area} onChange={update} className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5">{["Bole", "Kazanchis", "Sarbet", "Piassa", "Gerji", "CMC"].map((area) => <option key={area}>{area}</option>)}</select></label>
        <label className="text-sm font-semibold text-gray-700">Vehicle<select name="vehicle" value={form.vehicle} onChange={update} className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5">{["Motorcycle", "Bicycle", "Car", "On foot"].map((vehicle) => <option key={vehicle}>{vehicle}</option>)}</select></label>
        <label className="text-sm font-semibold text-gray-700">Vehicle plate (if applicable)<input name="plate" value={form.plate} onChange={update} className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5" placeholder="Plate number" /></label>
        <label className="text-sm font-semibold text-gray-700">Delivery experience<input name="experience" value={form.experience} onChange={update} className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5" placeholder="Optional" /></label>
        <button className="mt-2 rounded-xl bg-[#2f5d4a] px-5 py-3 font-bold text-white hover:bg-[#1e4033] sm:col-span-2">Send application</button>
      </form>}
    </div>
  </section></MobileAppShell>;
}
