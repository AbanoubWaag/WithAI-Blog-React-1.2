// Covers: simple reusable components, props
export const Spinner = () => (
  <div className="spinner-wrap">
    <div className="spinner"></div>
  </div>
);

export const Alert = ({ msg, type = "error" }) => {
  if (!msg) return null;
  return <div className={`alert alert-${type}`}>{msg}</div>;
};
