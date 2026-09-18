import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  Users,
  IndianRupee,
  Settings,
  LogOut,
  TrendingUp,
  Hotel,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  UserRound,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

import { gsap } from "../animations/gsapSetup";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const dashboardRef = useRef(null);
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const overviewRef = useRef(null);
  const recentRef = useRef(null);
  const bookingsRef = useRef(null);
  const roomsRef = useRef(null);
  const guestsRef = useRef(null);
  const revenueRef = useRef(null);
  const settingsRef = useRef(null);

  const [activeSection, setActiveSection] = useState("dashboard");

  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingFilter, setBookingFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingUpdating, setBookingUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  // =========================================
  // ROOM MANAGEMENT STATE
  // =========================================

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomSaving, setRoomSaving] = useState(false);
  const [roomDeleting, setRoomDeleting] = useState(false);
  const [roomFormError, setRoomFormError] = useState("");

  const [roomForm, setRoomForm] = useState({
    name: "",
    type: "",
    description: "",
    price: "",
    maxGuests: "",
    image: "",
    amenities: "",
    available: true,
  });

  // =========================================
  // FETCH DASHBOARD DATA
  // =========================================

  const fetchDashboardData = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const [roomsResponse, bookingsResponse] =
        await Promise.all([
          API.get("/rooms"),
          API.get("/bookings/admin/all"),
        ]);

      setRooms(roomsResponse.data?.rooms || []);

      setBookings(
        bookingsResponse.data?.bookings || []
      );
    } catch (err) {
      console.error(
        "Failed to load admin dashboard:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load dashboard information."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =========================================
  // ROOM STATISTICS
  // =========================================

  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    (room) => room.available === true
  ).length;

  const unavailableRooms = rooms.filter(
    (room) => room.available === false
  ).length;

  const roomAvailabilityPercentage =
    totalRooms > 0
      ? Math.round(
        (availableRooms / totalRooms) * 100
      )
      : 0;

  // =========================================
  // BOOKING STATISTICS
  // =========================================

  const totalBookings = bookings.length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const totalRevenue = bookings
    .filter(
      (booking) =>
        booking.status === "confirmed" ||
        booking.status === "completed"
    )
    .reduce(
      (sum, booking) =>
        sum + Number(booking.totalPrice || 0),
      0
    );

  // =========================================
  // UNIQUE GUESTS
  // =========================================

  const uniqueGuests = useMemo(() => {
    const guestIds = new Set();

    bookings.forEach((booking) => {
      if (booking.user?._id) {
        guestIds.add(booking.user._id);
      }
    });

    return guestIds.size;
  }, [bookings]);

  // =========================================
  // RECENT BOOKINGS
  // =========================================

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 6);
  }, [bookings]);
  

  const filteredBookings = useMemo(() => {
    const search = bookingSearch
      .trim()
      .toLowerCase();

    return bookings.filter((booking) => {
      const guestName =
        booking.user?.name?.toLowerCase() || "";

      const guestEmail =
        booking.user?.email?.toLowerCase() || "";

      const roomName =
        booking.room?.name?.toLowerCase() || "";

      const bookingId =
        booking._id?.toLowerCase() || "";

      const matchesSearch =
        !search ||
        guestName.includes(search) ||
        guestEmail.includes(search) ||
        roomName.includes(search) ||
        bookingId.includes(search);

      const matchesFilter =
        bookingFilter === "all" ||
        booking.status === bookingFilter;

      return matchesSearch && matchesFilter;
    });
  }, [
    bookings,
    bookingSearch,
    bookingFilter,
  ]);

  // =========================================
  // ROOM BOOKING COUNTS
  // =========================================

  const roomBookingStats = useMemo(() => {
    return rooms
      .map((room) => {
        const roomBookings = bookings.filter(
          (booking) =>
            booking.room?._id === room._id &&
            booking.status !== "cancelled"
        );

        return {
          ...room,
          bookingCount: roomBookings.length,
        };
      })
      .sort(
        (a, b) =>
          b.bookingCount - a.bookingCount
      );
  }, [rooms, bookings]);

  // =========================================
  // GSAP PAGE ANIMATIONS
  // =========================================

  useEffect(() => {
    if (loading) return;

    const dashboard = dashboardRef.current;

    if (!dashboard) return;

    const ctx = gsap.context(() => {
      // HEADER

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power4.out",
          }
        );
      }

      // STATS

      const statCards =
        statsRef.current?.querySelectorAll(
          ".admin-stat-card"
        );

      if (statCards?.length) {
        gsap.fromTo(
          statCards,
          {
            opacity: 0,
            y: 30,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: "power3.out",
          }
        );
      }

      // STAT CARD HOVER

      statCards?.forEach((card) => {
        card.addEventListener(
          "mouseenter",
          () => {
            gsap.to(card, {
              y: -5,
              duration: 0.25,
              ease: "power2.out",
            });
          }
        );

        card.addEventListener(
          "mouseleave",
          () => {
            gsap.to(card, {
              y: 0,
              duration: 0.25,
              ease: "power2.out",
            });
          }
        );
      });

      // OVERVIEW PANELS

      const overviewPanels =
        overviewRef.current?.querySelectorAll(
          ".admin-panel"
        );

      if (overviewPanels?.length) {
        gsap.fromTo(
          overviewPanels,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: overviewRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // RECENT BOOKINGS

      if (recentRef.current) {
        gsap.fromTo(
          recentRef.current,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: recentRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // ALL BOOKINGS

      const bookingCards =
        bookingsRef.current?.querySelectorAll(
          ".booking-admin-card"
        );

      if (bookingCards?.length) {
        gsap.fromTo(
          bookingCards,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bookingsRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // ROOM CARDS

      const roomCards =
        roomsRef.current?.querySelectorAll(
          ".admin-room-card"
        );

      if (roomCards?.length) {
        gsap.fromTo(
          roomCards,
          {
            opacity: 0,
            y: 35,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: roomsRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );

        roomCards.forEach((card) => {
          const image = card.querySelector(
            ".admin-room-image img"
          );

          if (!image) return;

          card.addEventListener(
            "mouseenter",
            () => {
              gsap.to(image, {
                scale: 1.07,
                duration: 0.6,
                ease: "power3.out",
              });
            }
          );

          card.addEventListener(
            "mouseleave",
            () => {
              gsap.to(image, {
                scale: 1,
                duration: 0.6,
                ease: "power3.out",
              });
            }
          );
        });
      }

      // GUESTS

      const guestCards =
        guestsRef.current?.querySelectorAll(
          ".guest-card"
        );

      if (guestCards?.length) {
        gsap.fromTo(
          guestCards,
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: guestsRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // REVENUE

      const revenueCards =
        revenueRef.current?.querySelectorAll(
          ".revenue-card"
        );

      if (revenueCards?.length) {
        gsap.fromTo(
          revenueCards,
          {
            opacity: 0,
            y: 30,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: revenueRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // SETTINGS

      if (settingsRef.current) {
        gsap.fromTo(
          settingsRef.current,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: settingsRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, dashboard);

    return () => ctx.revert();
  }, [loading, bookings.length, rooms.length]);

  // =========================================
  // NAVIGATION
  // =========================================

  const handleSectionChange = (section) => {
    setActiveSection(section);

    const element =
      document.getElementById(
        `admin-${section}`
      );

    if (element) {
      window.scrollTo({
        top:
          element.getBoundingClientRect().top +
          window.scrollY -
          30,
        behavior: "smooth",
      });
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =========================================
  // REFRESH
  // =========================================

  const handleRefresh = () => {
    fetchDashboardData(false);
  };

  // =========================================
  // ROOM MANAGEMENT
  // =========================================

  const resetRoomForm = () => {
    setRoomForm({
      name: "",
      type: "",
      description: "",
      price: "",
      maxGuests: "",
      image: "",
      amenities: "",
      available: true,
    });

    setEditingRoom(null);
    setRoomFormError("");
  };

  const openAddRoomModal = () => {
    resetRoomForm();
    setShowRoomModal(true);
  };

  const openEditRoomModal = (room) => {
    setEditingRoom(room);

    setRoomForm({
      name: room.name || "",
      type: room.type || "",
      description: room.description || "",
      price: room.price ?? "",
      maxGuests: room.maxGuests ?? "",
      image: room.image || "",
      amenities: Array.isArray(room.amenities)
        ? room.amenities.join(", ")
        : "",
      available: room.available !== false,
    });

    setRoomFormError("");
    setShowRoomModal(true);
  };

  const closeRoomModal = () => {
    if (roomSaving) return;

    setShowRoomModal(false);
    resetRoomForm();
  };

  const handleRoomInput = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setRoomForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleRoomSubmit = async (event) => {
    event.preventDefault();

    setRoomFormError("");

    const price = Number(roomForm.price);
    const maxGuests = Number(
      roomForm.maxGuests
    );

    if (
      !roomForm.name.trim() ||
      !roomForm.type.trim() ||
      !roomForm.description.trim() ||
      !roomForm.image.trim()
    ) {
      setRoomFormError(
        "Please fill in all required room details."
      );

      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setRoomFormError(
        "Price must be greater than 0."
      );

      return;
    }

    if (
      !Number.isInteger(maxGuests) ||
      maxGuests < 1
    ) {
      setRoomFormError(
        "Maximum guests must be at least 1."
      );

      return;
    }

    const payload = {
      name: roomForm.name.trim(),
      type: roomForm.type.trim(),
      description:
        roomForm.description.trim(),
      price,
      maxGuests,
      image: roomForm.image.trim(),

      amenities: roomForm.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      available: Boolean(
        roomForm.available
      ),
    };

    try {
      setRoomSaving(true);

      if (editingRoom) {
        await API.put(
          `/rooms/${editingRoom._id}`,
          payload
        );
      } else {
        await API.post(
          "/rooms",
          payload
        );
      }

      setShowRoomModal(false);
      resetRoomForm();

      await fetchDashboardData(false);
    } catch (err) {
      console.error(
        "Room save failed:",
        err
      );

      setRoomFormError(
        err.response?.data?.message ||
        "Unable to save room. Please try again."
      );
    } finally {
      setRoomSaving(false);
    }
  };

  const handleDeleteRoom = async (room) => {
    const confirmed = window.confirm(
      `Delete "${room.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setRoomDeleting(true);
      setError("");

      await API.delete(
        `/rooms/${room._id}`
      );

      await fetchDashboardData(false);
    } catch (err) {
      console.error(
        "Room deletion failed:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to delete room. Please try again."
      );
    } finally {
      setRoomDeleting(false);
    }
  };

  const handleToggleRoomAvailability =
    async (room) => {
      try {
        setError("");

        await API.put(
          `/rooms/${room._id}`,
          {
            available: !room.available,
          }
        );

        await fetchDashboardData(false);
      } catch (err) {
        console.error(
          "Room availability update failed:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Unable to update room availability."
        );
      }
    };

  // =========================================
  // BOOKING MANAGEMENT
  // =========================================

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const closeBookingDetails = () => {
    if (bookingUpdating) return;

    setShowBookingModal(false);
    setSelectedBooking(null);
  };

  const updateBookingStatus = async (
    booking,
    status
  ) => {
    if (!booking?._id) return;

    const statusText =
      status === "completed"
        ? "mark this booking as completed"
        : status === "cancelled"
          ? "cancel this booking"
          : "confirm this booking";

    const confirmed = window.confirm(
      `Are you sure you want to ${statusText}?`
    );

    if (!confirmed) return;

    try {
      setBookingUpdating(true);
      setError("");

      await API.put(
        `/bookings/admin/${booking._id}/status`,
        {
          status,
        }
      );

      setShowBookingModal(false);
      setSelectedBooking(null);

      await fetchDashboardData(false);
    } catch (err) {
      console.error(
        "Booking status update failed:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to update booking status."
      );
    } finally {
      setBookingUpdating(false);
    }
  };

  // =========================================
  // DATE FORMAT
  // =========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================
  // CURRENCY
  // =========================================

  const formatCurrency = (amount) => {
    return Number(
      amount || 0
    ).toLocaleString("en-IN");
  };

  // =========================================
  // STATUS
  // =========================================

  const getStatusClass = (status) => {
    if (status === "cancelled") {
      return "cancelled";
    }

    if (status === "completed") {
      return "completed";
    }

    return "confirmed";
  };

  // =========================================
  // STATS
  // =========================================

  const stats = [
    {
      title: "Total Bookings",
      value: totalBookings,
      change:
        totalBookings === 1
          ? "1 Reservation"
          : `${totalBookings} Reservations`,
      icon: <CalendarDays size={20} />,
    },

    {
      title: "Total Revenue",
      value: `₹${formatCurrency(
        totalRevenue
      )}`,
      change: "Confirmed & completed",
      icon: <IndianRupee size={20} />,
    },

    {
      title: "Total Guests",
      value: uniqueGuests,
      change:
        uniqueGuests === 1
          ? "1 Unique Guest"
          : `${uniqueGuests} Unique Guests`,
      icon: <Users size={20} />,
    },

    {
      title: "Total Rooms",
      value: totalRooms,
      change: `${availableRooms} Available`,
      icon: <BedDouble size={20} />,
    },
  ];

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-content">
          <LoaderCircle
            size={42}
            className="booking-loader"
          />

          <h2>AZUREA</h2>

          <p>
            Preparing your resort dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="admin-dashboard"
      ref={dashboardRef}
    >
      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>AZUREA</h2>
          <span>RESORT ADMIN</span>
        </div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeSection === "dashboard"
              ? "active"
              : ""
              }`}
            onClick={() =>
              handleSectionChange(
                "dashboard"
              )
            }
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </button>

          <button
            className={`admin-nav-item ${activeSection === "bookings"
              ? "active"
              : ""
              }`}
            onClick={() =>
              handleSectionChange(
                "bookings"
              )
            }
          >
            <CalendarDays size={19} />
            <span>Bookings</span>

            {totalBookings > 0 && (
              <b className="nav-count">
                {totalBookings}
              </b>
            )}
          </button>

          <button
            className={`admin-nav-item ${activeSection === "rooms"
              ? "active"
              : ""
              }`}
            onClick={() =>
              handleSectionChange("rooms")
            }
          >
            <BedDouble size={19} />
            <span>Rooms</span>
          </button>

          <button
            className={`admin-nav-item ${activeSection === "guests"
              ? "active"
              : ""
              }`}
            onClick={() =>
              handleSectionChange(
                "guests"
              )
            }
          >
            <Users size={19} />
            <span>Guests</span>
          </button>

          <button
            className={`admin-nav-item ${activeSection === "revenue"
              ? "active"
              : ""
              }`}
            onClick={() =>
              handleSectionChange(
                "revenue"
              )
            }
          >
            <IndianRupee size={19} />
            <span>Revenue</span>
          </button>

          <button
            className={`admin-nav-item ${activeSection === "settings"
              ? "active"
              : ""
              }`}
            onClick={() =>
              handleSectionChange(
                "settings"
              )
            }
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="admin-sidebar-bottom">
          <button
            className="admin-nav-item"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>

          <div className="admin-profile">
            <div className="admin-avatar">
              {user?.name
                ? user.name
                  .substring(0, 2)
                  .toUpperCase()
                : "AD"}
            </div>

            <div className="admin-profile-info">
              <strong>
                {user?.name ||
                  "Azurea Admin"}
              </strong>

              <span>
                {user?.role ||
                  "Administrator"}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* =====================================
          MAIN
      ===================================== */}

      <main className="admin-main">
        {/* HEADER */}

        <header
          className="admin-header"
          id="admin-dashboard"
          ref={headerRef}
        >
          <div className="admin-header-left">
            <p>RESORT MANAGEMENT</p>

            <h1>
              Welcome back,{" "}
              <span>
                {user?.name || "Admin"}.
              </span>
            </h1>

            <div className="admin-header-subtitle">
              Your AZUREA resort overview
            </div>
          </div>

          <div className="admin-header-right">
            <button
              className="admin-refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "refresh-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

            <div className="admin-date">
              {new Date().toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }
              )}
            </div>
          </div>
        </header>

        {/* ERROR */}

        {error && (
          <div className="admin-error-message">
            <AlertCircle size={18} />

            <div>
              <strong>
                Dashboard data error
              </strong>

              <span>{error}</span>
            </div>

            <button
              onClick={() =>
                fetchDashboardData()
              }
            >
              Retry
            </button>
          </div>
        )}

        {/* STATS */}

        <section
          className="admin-stats"
          ref={statsRef}
        >
          {stats.map((stat) => (
            <div
              className="admin-stat-card"
              key={stat.title}
            >
              <div className="admin-stat-top">
                <div className="admin-stat-icon">
                  {stat.icon}
                </div>

                <span className="admin-stat-change">
                  {stat.change}
                </span>
              </div>

              <h3>{stat.value}</h3>

              <p>{stat.title}</p>
            </div>
          ))}
        </section>

        {/* OVERVIEW */}

        <section
          className="admin-content-grid"
          ref={overviewRef}
        >
          {/* ROOM AVAILABILITY */}

          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <p className="panel-eyebrow">
                  INVENTORY
                </p>

                <h2>
                  Room Availability
                </h2>
              </div>

              <button
                onClick={() =>
                  handleSectionChange(
                    "rooms"
                  )
                }
              >
                View Rooms
              </button>
            </div>

            <div className="availability-container">
              <div
                className="availability-circle"
                style={{
                  "--availability": `${roomAvailabilityPercentage}%`,
                }}
              >
                <div className="availability-number">
                  <strong>
                    {roomAvailabilityPercentage}%
                  </strong>

                  <span>AVAILABLE</span>
                </div>
              </div>

              <div className="availability-details">
                <div className="availability-row">
                  <span>Total Rooms</span>
                  <strong>
                    {totalRooms}
                  </strong>
                </div>

                <div className="availability-row">
                  <span>Available</span>
                  <strong>
                    {availableRooms}
                  </strong>
                </div>

                <div className="availability-row">
                  <span>Unavailable</span>
                  <strong>
                    {unavailableRooms}
                  </strong>
                </div>

                <div className="availability-row">
                  <span>
                    Active Reservations
                  </span>

                  <strong>
                    {confirmedBookings}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* BOOKING OVERVIEW */}

          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <p className="panel-eyebrow">
                  RESERVATIONS
                </p>

                <h2>
                  Booking Overview
                </h2>
              </div>

              <button
                onClick={() =>
                  handleSectionChange(
                    "bookings"
                  )
                }
              >
                View All
              </button>
            </div>

            <div className="booking-overview-list">
              <div className="overview-stat">
                <div className="overview-stat-icon confirmed">
                  <CheckCircle2 size={19} />
                </div>

                <div>
                  <strong>
                    {confirmedBookings}
                  </strong>

                  <span>Confirmed</span>
                </div>
              </div>

              <div className="overview-stat">
                <div className="overview-stat-icon completed">
                  <Hotel size={19} />
                </div>

                <div>
                  <strong>
                    {completedBookings}
                  </strong>

                  <span>Completed</span>
                </div>
              </div>

              <div className="overview-stat">
                <div className="overview-stat-icon cancelled">
                  <XCircle size={19} />
                </div>

                <div>
                  <strong>
                    {cancelledBookings}
                  </strong>

                  <span>Cancelled</span>
                </div>
              </div>
            </div>

            <div className="overview-revenue">
              <div>
                <span>
                  BOOKING REVENUE
                </span>

                <strong>
                  ₹
                  {formatCurrency(
                    totalRevenue
                  )}
                </strong>
              </div>

              <TrendingUp size={28} />
            </div>
          </div>
        </section>

        {/* RECENT BOOKINGS */}

        <section
          className="admin-table-panel"
          ref={recentRef}
        >
          <div className="admin-table-header">
            <div>
              <p className="panel-eyebrow">
                LIVE DATA
              </p>

              <h2>Recent Bookings</h2>

              <p className="admin-section-subtitle">
                Reservations fetched directly
                from MongoDB
              </p>
            </div>

            <button
              className="admin-view-all"
              onClick={() =>
                handleSectionChange(
                  "bookings"
                )
              }
            >
              All Bookings
              <ArrowRight size={15} />
            </button>
          </div>

          {recentBookings.length === 0 ? (
            <div className="admin-empty-state">
              <CalendarDays size={42} />

              <h3>No bookings yet</h3>

              <p>
                New reservations will appear
                here automatically.
              </p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>GUEST</th>
                    <th>ROOM</th>
                    <th>CHECK-IN</th>
                    <th>CHECK-OUT</th>
                    <th>GUESTS</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {recentBookings.map(
                    (booking) => {
                      const guest =
                        booking.user;

                      const room =
                        booking.room;

                      return (
                        <tr
                          key={
                            booking._id
                          }
                        >
                          <td>
                            <div className="admin-guest">
                              <div className="admin-guest-avatar">
                                {guest?.name
                                  ? guest.name
                                    .substring(
                                      0,
                                      2
                                    )
                                    .toUpperCase()
                                  : "GU"}
                              </div>

                              <div>
                                <div className="admin-guest-name">
                                  {guest?.name ||
                                    "Guest"}
                                </div>

                                <div className="admin-guest-email">
                                  {guest?.email ||
                                    "—"}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="admin-room">
                              {room?.name ||
                                "Room"}
                            </span>
                          </td>

                          <td>
                            {formatDate(
                              booking.checkIn
                            )}
                          </td>

                          <td>
                            {formatDate(
                              booking.checkOut
                            )}
                          </td>

                          <td>
                            {booking.guests}
                          </td>

                          <td>
                            <strong className="admin-amount">
                              ₹
                              {formatCurrency(
                                booking.totalPrice
                              )}
                            </strong>
                          </td>

                          <td>
                            <span
                              className={`booking-status-badge ${getStatusClass(
                                booking.status
                              )}`}
                            >
                              {booking.status ||
                                "confirmed"}
                            </span>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ALL BOOKINGS */}

      <section>
          <div className="admin-section-heading">
          <div>
            <p className="panel-eyebrow">
              RESERVATION MANAGEMENT
            </p>

            <h2>All Bookings</h2>
          </div>

          <span>
            {filteredBookings.length} of {totalBookings}
          </span>
        </div>

        {/* BOOKING CONTROLS */}

        <div className="booking-management-controls">

          <div className="booking-search-box">
            <input
              type="text"
              placeholder="Search guest, email, room or booking ID..."
              value={bookingSearch}
              onChange={(event) =>
                setBookingSearch(event.target.value)
              }
            />
          </div>

          <div className="booking-filter-buttons">

            <button
              type="button"
              className={
                bookingFilter === "all"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setBookingFilter("all")
              }
            >
              All
            </button>

            <button
              type="button"
              className={
                bookingFilter === "confirmed"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setBookingFilter("confirmed")
              }
            >
              Confirmed
            </button>

            <button
              type="button"
              className={
                bookingFilter === "completed"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setBookingFilter("completed")
              }
            >
              Completed
            </button>

            <button
              type="button"
              className={
                bookingFilter === "cancelled"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setBookingFilter("cancelled")
              }
            >
              Cancelled
            </button>

          </div>

        </div>

        {/* BOOKINGS */}

        <div className="booking-cards-list">

          {filteredBookings.length === 0 ? (
            <div className="admin-empty-state">

              <CalendarDays size={40} />

              <h3>No bookings found</h3>

              <p>
                Try changing your search or filter.
              </p>

            </div>
          ) : (
            filteredBookings.map((booking) => (

              <div
                className="booking-admin-card"
                key={booking._id}
              >

                {/* GUEST */}

                <div className="booking-admin-main">

                  <div className="booking-admin-icon">
                    <CalendarDays size={20} />
                  </div>

                  <div>

                    <strong>
                      {booking.room?.name ||
                        "Azurea Room"}
                    </strong>

                    <span>
                      {booking.user?.name ||
                        "Guest"}
                      {" • "}
                      {booking.user?.email ||
                        "No email"}
                    </span>

                  </div>

                </div>

                {/* STAY */}

                <div className="booking-admin-date">

                  <span>STAY</span>

                  <strong>
                    {formatDate(
                      booking.checkIn
                    )}

                    {" → "}

                    {formatDate(
                      booking.checkOut
                    )}
                  </strong>

                </div>

                {/* GUESTS */}

                <div className="booking-admin-guests">

                  <span>GUESTS</span>

                  <strong>
                    {booking.guests}
                  </strong>

                </div>

                {/* TOTAL */}

                <div className="booking-admin-price">

                  <span>TOTAL</span>

                  <strong>
                    ₹
                    {formatCurrency(
                      booking.totalPrice
                    )}
                  </strong>

                </div>

                {/* STATUS */}

                <span
                  className={`booking-status-badge ${getStatusClass(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>

                {/* VIEW */}

                <button
                  type="button"
                  className="booking-view-btn"
                  onClick={() =>
                    openBookingDetails(
                      booking
                    )
                  }
                >
                  View
                  <ArrowRight size={14} />
                </button>

              </div>

            ))
          )}

        </div>
      </section>

      {/* ROOMS */}

      <section
        className="admin-full-section"
        id="admin-rooms"
        ref={roomsRef}
      >
        <div className="admin-section-heading">
          <div>
            <p className="panel-eyebrow">
              RESORT INVENTORY
            </p>

            <h2>Resort Rooms</h2>
          </div>

          <div className="admin-room-actions">
            <button
              className="outline-action"
              onClick={() =>
                navigate("/rooms")
              }
            >
              View Resort
              <ArrowRight size={15} />
            </button>

            <button
              className="admin-primary-action"
              onClick={
                openAddRoomModal
              }
            >
              <Plus size={16} />
              Add Room
            </button>
          </div>
        </div>

        <div className="admin-room-grid">
          {rooms.length === 0 ? (
            <div className="admin-empty-state">
              <BedDouble size={40} />

              <h3>No Rooms</h3>

              <p>
                Add your first resort room
                from the button above.
              </p>
            </div>
          ) : (
            rooms.map((room) => {
              const roomStats =
                roomBookingStats.find(
                  (item) =>
                    item._id ===
                    room._id
                );

              return (
                <div
                  className="admin-room-card"
                  key={room._id}
                >
                  <div className="admin-room-image">
                    <img
                      src={room.image}
                      alt={room.name}
                    />

                    <span
                      className={`room-live-status ${room.available
                        ? "available"
                        : "unavailable"
                        }`}
                    >
                      {room.available
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>

                  <div className="admin-room-info">
                    <p>{room.type}</p>

                    <h3>{room.name}</h3>

                    <div className="admin-room-meta">
                      <span>
                        <Users size={14} />
                        {room.maxGuests}{" "}
                        Guests
                      </span>

                      <strong>
                        ₹
                        {formatCurrency(
                          room.price
                        )}

                        <small>
                          /night
                        </small>
                      </strong>
                    </div>

                    <div className="room-booking-count">
                      {roomStats?.bookingCount ||
                        0}{" "}
                      booking
                      {(roomStats?.bookingCount ||
                        0) !== 1
                        ? "s"
                        : ""}
                    </div>

                    {/* ROOM MANAGEMENT */}

                    <div className="admin-room-card-actions">
                      <button
                        type="button"
                        className={`room-availability-toggle ${room.available
                          ? "is-available"
                          : "is-unavailable"
                          }`}
                        onClick={() =>
                          handleToggleRoomAvailability(
                            room
                          )
                        }
                      >
                        {room.available
                          ? "Mark Unavailable"
                          : "Mark Available"}
                      </button>

                      <div className="room-management-actions">
                        <button
                          type="button"
                          className="room-edit-btn"
                          onClick={() =>
                            openEditRoomModal(
                              room
                            )
                          }
                        >
                          <Pencil
                            size={15}
                          />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="room-delete-btn"
                          onClick={() =>
                            handleDeleteRoom(
                              room
                            )
                          }
                          disabled={
                            roomDeleting
                          }
                        >
                          <Trash2
                            size={15}
                          />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* GUESTS */}

      <section
        className="admin-full-section"
        id="admin-guests"
        ref={guestsRef}
      >
        <div className="admin-section-heading">
          <div>
            <p className="panel-eyebrow">
              GUEST MANAGEMENT
            </p>

            <h2>Guests</h2>
          </div>

          <span>
            {uniqueGuests} unique guests
          </span>
        </div>

        <div className="guest-grid">
          {bookings.length === 0 ? (
            <div className="admin-empty-state">
              <Users size={40} />

              <h3>No Guests Yet</h3>

              <p>
                Guests will appear here after
                making a reservation.
              </p>
            </div>
          ) : (
            Array.from(
              new Map(
                bookings
                  .filter(
                    (booking) =>
                      booking.user?._id
                  )
                  .map((booking) => [
                    booking.user._id,
                    booking.user,
                  ])
              ).values()
            ).map((guest) => (
              <div
                className="guest-card"
                key={guest._id}
              >
                <div className="guest-card-avatar">
                  {guest.name
                    ?.substring(0, 2)
                    .toUpperCase() ||
                    "GU"}
                </div>

                <div>
                  <strong>
                    {guest.name ||
                      "Guest"}
                  </strong>

                  <span>
                    {guest.email ||
                      "No email"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* REVENUE */}

      <section
        className="admin-full-section"
        id="admin-revenue"
        ref={revenueRef}
      >
        <div className="admin-section-heading">
          <div>
            <p className="panel-eyebrow">
              FINANCIAL OVERVIEW
            </p>

            <h2>Revenue</h2>
          </div>
        </div>

        <div className="revenue-grid">
          <div className="revenue-card featured">
            <div className="revenue-icon">
              <IndianRupee size={22} />
            </div>

            <span>TOTAL REVENUE</span>

            <strong>
              ₹
              {formatCurrency(
                totalRevenue
              )}
            </strong>

            <small>
              Confirmed and completed
              reservations
            </small>
          </div>

          <div className="revenue-card">
            <span>CONFIRMED</span>

            <strong>
              ₹
              {formatCurrency(
                bookings
                  .filter(
                    (booking) =>
                      booking.status ===
                      "confirmed"
                  )
                  .reduce(
                    (sum, booking) =>
                      sum +
                      Number(
                        booking.totalPrice ||
                        0
                      ),
                    0
                  )
              )}
            </strong>

            <small>
              {confirmedBookings} active
              reservations
            </small>
          </div>

          <div className="revenue-card">
            <span>COMPLETED</span>

            <strong>
              ₹
              {formatCurrency(
                bookings
                  .filter(
                    (booking) =>
                      booking.status ===
                      "completed"
                  )
                  .reduce(
                    (sum, booking) =>
                      sum +
                      Number(
                        booking.totalPrice ||
                        0
                      ),
                    0
                  )
              )}
            </strong>

            <small>
              {completedBookings} completed
              stays
            </small>
          </div>

          <div className="revenue-card">
            <span>CANCELLED</span>

            <strong>
              {cancelledBookings}
            </strong>

            <small>
              Not included in revenue
            </small>
          </div>
        </div>
      </section>

      {/* SETTINGS */}

      <section
        className="admin-full-section"
        id="admin-settings"
        ref={settingsRef}
      >
        <div className="admin-section-heading">
          <div>
            <p className="panel-eyebrow">
              ACCOUNT
            </p>

            <h2>Settings</h2>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-user-icon">
            <UserRound size={22} />
          </div>

          <div className="settings-user-info">
            <span>ADMINISTRATOR</span>

            <h3>
              {user?.name ||
                "Azurea Admin"}
            </h3>

            <p>
              {user?.email ||
                "No email available"}
            </p>
          </div>

          <div className="settings-role">
            <span>ROLE</span>

            <strong>
              {user?.role || "admin"}
            </strong>
          </div>
        </div>
      </section>

      {/* =====================================
            ROOM MODAL
        ===================================== */}

      {showRoomModal && (
        <div
          className="room-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeRoomModal();
            }
          }}
        >
          <div
            className="room-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="room-modal-title"
          >
            <div className="room-modal-header">
              <div>
                <p className="panel-eyebrow">
                  RESORT INVENTORY
                </p>

                <h2 id="room-modal-title">
                  {editingRoom
                    ? "Edit Room"
                    : "Add New Room"}
                </h2>
              </div>

              <button
                type="button"
                className="room-modal-close"
                onClick={
                  closeRoomModal
                }
                disabled={roomSaving}
                aria-label="Close room form"
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="room-form"
              onSubmit={
                handleRoomSubmit
              }
            >
              {roomFormError && (
                <div className="room-form-error">
                  <AlertCircle
                    size={17}
                  />

                  <span>
                    {roomFormError}
                  </span>
                </div>
              )}

              <div className="room-form-grid">
                <label>
                  <span>
                    Room Name *
                  </span>

                  <input
                    name="name"
                    value={
                      roomForm.name
                    }
                    onChange={
                      handleRoomInput
                    }
                    placeholder="e.g. Ocean View Villa"
                    required
                  />
                </label>

                <label>
                  <span>
                    Room Type *
                  </span>

                  <input
                    name="type"
                    value={
                      roomForm.type
                    }
                    onChange={
                      handleRoomInput
                    }
                    placeholder="e.g. Villa"
                    required
                  />
                </label>

                <label>
                  <span>
                    Price / Night (₹) *
                  </span>

                  <input
                    name="price"
                    type="number"
                    min="1"
                    value={
                      roomForm.price
                    }
                    onChange={
                      handleRoomInput
                    }
                    placeholder="15000"
                    required
                  />
                </label>

                <label>
                  <span>
                    Maximum Guests *
                  </span>

                  <input
                    name="maxGuests"
                    type="number"
                    min="1"
                    step="1"
                    value={
                      roomForm.maxGuests
                    }
                    onChange={
                      handleRoomInput
                    }
                    placeholder="4"
                    required
                  />
                </label>
              </div>

              <label>
                <span>
                  Image URL *
                </span>

                <input
                  name="image"
                  type="url"
                  value={
                    roomForm.image
                  }
                  onChange={
                    handleRoomInput
                  }
                  placeholder="https://..."
                  required
                />
              </label>

              <label>
                <span>
                  Description *
                </span>

                <textarea
                  name="description"
                  value={
                    roomForm.description
                  }
                  onChange={
                    handleRoomInput
                  }
                  placeholder="Describe the room and its experience..."
                  rows="4"
                  required
                />
              </label>

              <label>
                <span>
                  Amenities
                </span>

                <input
                  name="amenities"
                  value={
                    roomForm.amenities
                  }
                  onChange={
                    handleRoomInput
                  }
                  placeholder="Wi-Fi, Pool, Breakfast, Ocean View"
                />

                <small>
                  Separate amenities
                  with commas.
                </small>
              </label>

              <label className="room-availability-field">
                <input
                  name="available"
                  type="checkbox"
                  checked={
                    roomForm.available
                  }
                  onChange={
                    handleRoomInput
                  }
                />

                <span>
                  Room is currently
                  available
                </span>
              </label>

              <div className="room-form-actions">
                <button
                  type="button"
                  className="room-cancel-btn"
                  onClick={
                    closeRoomModal
                  }
                  disabled={roomSaving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="room-save-btn"
                  disabled={roomSaving}
                >
                  {roomSaving ? (
                    <>
                      <LoaderCircle
                        size={16}
                        className="refresh-spin"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />

                      {editingRoom
                        ? "Save Changes"
                        : "Create Room"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
{/* =====================================
    BOOKING DETAILS MODAL
===================================== */}

{showBookingModal &&
  selectedBooking && (
    <div
      className="booking-modal-backdrop"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          closeBookingDetails();
        }
      }}
    >

      <div
        className="booking-modal"
        role="dialog"
        aria-modal="true"
      >

        <div className="booking-modal-header">

          <div>
            <p className="panel-eyebrow">
              RESERVATION DETAILS
            </p>

            <h2>
              Booking Details
            </h2>
          </div>

          <button
            type="button"
            className="booking-modal-close"
            onClick={
              closeBookingDetails
            }
            disabled={
              bookingUpdating
            }
          >
            <X size={20} />
          </button>

        </div>

        {/* BOOKING ID */}

        <div className="booking-detail-id">

          <span>BOOKING ID</span>

          <strong>
            {selectedBooking._id}
          </strong>

        </div>

        {/* GUEST */}

        <div className="booking-detail-grid">

          <div className="booking-detail-item">

            <span>GUEST</span>

            <strong>
              {selectedBooking.user?.name ||
                "Guest"}
            </strong>

          </div>

          <div className="booking-detail-item">

            <span>EMAIL</span>

            <strong>
              {selectedBooking.user?.email ||
                "—"}
            </strong>

          </div>

          <div className="booking-detail-item">

            <span>ROOM</span>

            <strong>
              {selectedBooking.room?.name ||
                "Azurea Room"}
            </strong>

          </div>

          <div className="booking-detail-item">

            <span>ROOM TYPE</span>

            <strong>
              {selectedBooking.room?.type ||
                "—"}
            </strong>

          </div>

          <div className="booking-detail-item">

            <span>CHECK-IN</span>

            <strong>
              {formatDate(
                selectedBooking.checkIn
              )}
            </strong>

          </div>

          <div className="booking-detail-item">

            <span>CHECK-OUT</span>

            <strong>
              {formatDate(
                selectedBooking.checkOut
              )}
            </strong>

          </div>

          <div className="booking-detail-item">

            <span>GUESTS</span>

            <strong>
              {selectedBooking.guests}
            </strong>

          </div>

          <div className="booking-detail-item">

            <span>NIGHTS</span>

            <strong>
              {selectedBooking.nights}
            </strong>

          </div>

        </div>

        {/* TOTAL */}

        <div className="booking-detail-total">

          <span>TOTAL AMOUNT</span>

          <strong>
            ₹
            {formatCurrency(
              selectedBooking.totalPrice
            )}
          </strong>

        </div>

        {/* STATUS */}

        <div className="booking-detail-status">

          <span>STATUS</span>

          <span
            className={`booking-status-badge ${getStatusClass(
              selectedBooking.status
            )}`}
          >
            {selectedBooking.status}
          </span>

        </div>

        {/* ACTIONS */}

        <div className="booking-detail-actions">

          {selectedBooking.status ===
            "confirmed" && (
            <>
              <button
                type="button"
                className="booking-complete-btn"
                onClick={() =>
                  updateBookingStatus(
                    selectedBooking,
                    "completed"
                  )
                }
                disabled={
                  bookingUpdating
                }
              >
                <CheckCircle2
                  size={16}
                />

                Mark Completed
              </button>

              <button
                type="button"
                className="booking-cancel-btn"
                onClick={() =>
                  updateBookingStatus(
                    selectedBooking,
                    "cancelled"
                  )
                }
                disabled={
                  bookingUpdating
                }
              >
                <XCircle
                  size={16}
                />

                Cancel Booking
              </button>
            </>
          )}

          {selectedBooking.status ===
            "cancelled" && (
            <button
              type="button"
              className="booking-confirm-btn"
              onClick={() =>
                updateBookingStatus(
                  selectedBooking,
                  "confirmed"
                )
              }
              disabled={
                bookingUpdating
              }
            >
              <CheckCircle2
                size={16}
              />

              Restore Booking
            </button>
          )}

          {selectedBooking.status ===
            "completed" && (
            <div className="booking-completed-message">
              <CheckCircle2
                size={18}
              />

              This reservation has been
              completed.
            </div>
          )}

        </div>

      </div>

    </div>
  )}
      {/* FOOTER */}

      <footer className="admin-footer">
        <span>
          AZUREA BEACH RESORT
        </span>

        <span>
          ADMIN MANAGEMENT SYSTEM
        </span>
      </footer>
    </main>
    </div >
  );
};

export default AdminDashboard;