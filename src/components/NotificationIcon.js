
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBell } from 'react-icons/fa';

const NotificationIcon = ({ user }) => {
  const [hasToday, setHasToday] = useState(false);
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    if (!user || !user._id) {
      setHasToday(false);
      return;
    }
    const fetchAppointments = async () => {
      try {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;
        const res = await axios.get(`/api/appointments?userId=${user._id}`);
        const hasTodayAppt = (res.data.data || []).some(app => {
          const appDate = new Date(app.date);
          const appStr = `${appDate.getFullYear()}-${String(appDate.getMonth() + 1).padStart(2, '0')}-${String(appDate.getDate()).padStart(2, '0')}`;
          return appStr === todayStr && app.status !== 'cancelled';
        });
        setHasToday(hasTodayAppt);
      } catch {
        setHasToday(false);
      }
    };
    fetchAppointments();
  }, [user]);

  return (
    <div className="position-relative ms-3" style={{cursor:'pointer'}} onClick={() => hasToday && setShowMsg(v => !v)}>
      <FaBell size={22} color="#ffc107" />
      {hasToday && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize:'0.7rem'}}>!</span>
      )}
      {showMsg && hasToday && (
        <div className="notification-tooltip bg-light text-dark p-2 rounded shadow position-absolute end-0 mt-2 fw-bold text-center" style={{minWidth:220, zIndex:1000}}>
          You have an appointment today!
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
