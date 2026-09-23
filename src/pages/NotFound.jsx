import { FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";
import MobileAppShell from "../components/MobileAppShell";

export default function NotFound() {
  return (
    <MobileAppShell>
      <div className="customer-page text-center py-24">
        <FiHome className="mx-auto mb-4 text-4xl text-green-600" />
        <h1 className="mb-3">Page not found</h1>
        <p className="mb-6 text-gray-500">
          The page you are looking for does not exist.
        </p>
        <Link to="/" className="customer-primary-action justify-center">
          Back to menu
        </Link>
      </div>
    </MobileAppShell>
  );
}
