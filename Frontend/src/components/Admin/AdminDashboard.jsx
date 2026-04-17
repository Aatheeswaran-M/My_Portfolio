import React, { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";
import {
  ArrowLeft,
  Award,
  BriefcaseBusiness,
  ExternalLink,
  FolderKanban,
  Image,
  Link as LinkIcon,
  Phone,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { getPortfolio, savePortfolio } from "../../api";
import {
  createEmptyCertificate,
  createEmptyExperience,
  createEmptyProject,
  createEmptySkill,
  normalizePortfolioData,
} from "../../data/portfolioDefaults";

const parseLines = (value) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });

const dataUrlToApproxBytes = (dataUrl) => Math.ceil((String(dataUrl || "").length * 3) / 4);

const compressImageDataUrl = (dataUrl, { maxDimension, quality }) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Canvas not supported in this browser."));
        return;
      }

      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/webp", quality));
    };

    image.onerror = () => reject(new Error("Could not process image."));
    image.src = dataUrl;
  });

const readCompressedImageAsDataUrl = async (file) => {
  const sourceDataUrl = await readFileAsDataUrl(file);

  try {
    let compressedDataUrl = await compressImageDataUrl(sourceDataUrl, {
      maxDimension: 1600,
      quality: 0.78,
    });

    if (compressedDataUrl.length > 1_500_000) {
      compressedDataUrl = await compressImageDataUrl(sourceDataUrl, {
        maxDimension: 1200,
        quality: 0.66,
      });
    }

    if (compressedDataUrl.length > 1_000_000) {
      compressedDataUrl = await compressImageDataUrl(sourceDataUrl, {
        maxDimension: 960,
        quality: 0.58,
      });
    }

    return compressedDataUrl;
  } catch (error) {
    // Fall back to original image data URL if compression pipeline fails.
    return sourceDataUrl;
  }
};

const isPdfLike = (value) =>
  typeof value === "string" &&
  (value.startsWith("data:application/pdf") || value.toLowerCase().endsWith(".pdf"));

const Field = ({ label, textarea = false, className = "", ...props }) => (
  <label className={`admin-field ${className}`}>
    <span>{label}</span>
    {textarea ? <textarea {...props} /> : <input {...props} />}
  </label>
);

const SectionHeader = ({ icon: Icon, title, description, action }) => (
  <div className="admin-section-head">
    <div>
      <p className="admin-overline">
        <Icon size={16} />
        <span>{title}</span>
      </p>
      <h2>{description}</h2>
    </div>
    {action}
  </div>
);

const AdminDashboard = ({ initialPortfolio, onClose, onSaved }) => {
  const [draft, setDraft] = useState(() =>
    normalizePortfolioData(initialPortfolio || {})
  );
  const [adminKey, setAdminKey] = useState(
    () => window.localStorage.getItem("portfolio-admin-key") || ""
  );
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!initialPortfolio);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    setDraft(normalizePortfolioData(initialPortfolio || {}));
  }, [initialPortfolio]);

  useEffect(() => {
    if (initialPortfolio) return undefined;

    let cancelled = false;

    const loadPortfolio = async () => {
      try {
        const data = await getPortfolio();
        if (!cancelled) {
          setDraft(normalizePortfolioData(data));
        }
      } catch (error) {
        if (!cancelled) {
          setStatus({
            type: "error",
            message: "Unable to load live portfolio data. Showing local defaults instead.",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPortfolio();

    return () => {
      cancelled = true;
    };
  }, [initialPortfolio]);

  const metrics = useMemo(
    () => [
      { label: "Projects", value: draft.projects.length },
      { label: "Certificates", value: draft.certificates.length },
      { label: "Skills", value: draft.skills.length },
      { label: "Experience", value: draft.experience.length },
    ],
    [draft]
  );

  const updateProfile = (field, value) => {
    setDraft((current) => ({
      ...current,
      profile: {
        ...current.profile,
        [field]: value,
      },
    }));
  };

  const updateSocial = (field, value) => {
    setDraft((current) => ({
      ...current,
      profile: {
        ...current.profile,
        socialLinks: {
          ...current.profile.socialLinks,
          [field]: value,
        },
      },
    }));
  };

  const updateResume = (field, value) => {
    setDraft((current) => ({
      ...current,
      resume: {
        ...current.resume,
        [field]: value,
      },
    }));
  };

  const updateCollectionItem = (section, index, field, value) => {
    setDraft((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));
  };

  const addCollectionItem = (section, factory) => {
    setDraft((current) => ({
      ...current,
      [section]: [...current[section], factory(current[section].length)],
    }));
  };

  const removeCollectionItem = (section, index) => {
    setDraft((current) => ({
      ...current,
      [section]: current[section].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const moveCollectionItem = (section, index, direction) => {
    setDraft((current) => {
      const items = [...current[section]];
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= items.length) {
        return current;
      }

      const [item] = items.splice(index, 1);
      items.splice(nextIndex, 0, item);

      return {
        ...current,
        [section]: items,
      };
    });
  };

  const buildPayload = () => ({
    ...draft,
    skills: draft.skills.map((skill, index) => ({
      ...skill,
      sortOrder: index,
    })),
    experience: draft.experience.map((item, index) => ({
      ...item,
      sortOrder: index,
    })),
    projects: draft.projects.map((project, index) => ({
      ...project,
      sortOrder: index,
    })),
    certificates: draft.certificates.map((certificate, index) => ({
      ...certificate,
      sortOrder: index,
    })),
  });

  const handleSave = async () => {
    setSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const saved = await savePortfolio(buildPayload(), adminKey);
      setDraft(saved);
      onSaved?.(saved);
      window.localStorage.setItem("portfolio-admin-key", adminKey);
      setStatus({
        type: "success",
        message: "Portfolio content saved successfully.",
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save portfolio content.";

      setStatus({
        type: "error",
        message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAssetUpload = async ({
    file,
    maxSizeMb,
    onSuccess,
    onErrorMessage,
  }) => {
    if (!file) return;

    const isImageFile = String(file.type || "").startsWith("image/");
    const hardFileLimitMb = isImageFile ? Math.max(maxSizeMb * 3, 10) : maxSizeMb;

    if (file.size > hardFileLimitMb * 1024 * 1024) {
      setStatus({
        type: "error",
        message: `${onErrorMessage} File size must be less than ${hardFileLimitMb}MB.`,
      });
      return;
    }

    try {
      const dataUrl = isImageFile
        ? await readCompressedImageAsDataUrl(file)
        : await readFileAsDataUrl(file);
      const approxDataSizeBytes = dataUrlToApproxBytes(dataUrl);

      if (approxDataSizeBytes > maxSizeMb * 1024 * 1024) {
        setStatus({
          type: "error",
          message: `${onErrorMessage} Processed file is still too large (${(
            approxDataSizeBytes /
            (1024 * 1024)
          ).toFixed(2)}MB). Use a smaller image or hosted URL.`,
        });
        return;
      }

      onSuccess(dataUrl);

      const savedPercent = isImageFile
        ? Math.max(0, Math.round((1 - approxDataSizeBytes / file.size) * 100))
        : 0;

      setStatus({
        type: "success",
        message: isImageFile
          ? `${file.name} optimized (${savedPercent}% smaller) and added to draft. Click Save Changes to persist.`
          : `${file.name} uploaded to draft. Click Save Changes to persist.`,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: onErrorMessage,
      });
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <header className="admin-topbar">
          <div>
            <button type="button" className="admin-back" onClick={onClose}>
              <ArrowLeft size={16} />
              <span>Back to Portfolio</span>
            </button>
            <p className="admin-kicker">Portfolio Control Center</p>
            <h1>Admin Dashboard</h1>
            <p className="admin-copy">
              Edit hero content, about text, phone number, links, skills,
              experience, projects, certificates, and resume details from one place.
            </p>
          </div>

          <div className="admin-actions">
            <label className="admin-key">
              <span>Admin key</span>
              <input
                type="password"
                value={adminKey}
                placeholder="Optional if your backend is open"
                onChange={(event) => setAdminKey(event.target.value)}
              />
            </label>

            <button
              type="button"
              className="admin-save"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={16} />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </header>

        <section className="admin-metrics">
          {metrics.map((metric) => (
            <article key={metric.label} className="admin-metric-card">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </section>

        {status.message ? (
          <div className={`admin-status ${status.type}`}>{status.message}</div>
        ) : null}

        <div className="admin-grid">
          <section className="admin-card admin-card-wide">
            <SectionHeader
              icon={Sparkles}
              title="Hero + About"
              description="Shape the first impression and story of your portfolio."
            />

            <div className="admin-form-grid">
              <Field
                label="Name"
                value={draft.profile.name}
                onChange={(event) => updateProfile("name", event.target.value)}
              />
              <Field
                label="Role / Title"
                value={draft.profile.title}
                onChange={(event) => updateProfile("title", event.target.value)}
              />
              <Field
                label="Hero badge"
                value={draft.profile.heroBadge}
                onChange={(event) =>
                  updateProfile("heroBadge", event.target.value)
                }
              />
              <Field
                label="Availability"
                value={draft.profile.availability}
                onChange={(event) =>
                  updateProfile("availability", event.target.value)
                }
              />
              <Field
                label="Hero title line 1"
                value={draft.profile.heroTitlePrimary}
                onChange={(event) =>
                  updateProfile("heroTitlePrimary", event.target.value)
                }
              />
              <Field
                label="Hero title line 2"
                value={draft.profile.heroTitleSecondary}
                onChange={(event) =>
                  updateProfile("heroTitleSecondary", event.target.value)
                }
              />
              <Field
                label="Hero description"
                textarea
                rows={4}
                className="admin-span-2"
                value={draft.profile.heroDescription}
                onChange={(event) =>
                  updateProfile("heroDescription", event.target.value)
                }
              />
              <Field
                label="Profile bio"
                textarea
                rows={4}
                className="admin-span-2"
                value={draft.profile.bio}
                onChange={(event) => updateProfile("bio", event.target.value)}
              />
              <Field
                label="About heading"
                value={draft.profile.aboutHeading}
                onChange={(event) =>
                  updateProfile("aboutHeading", event.target.value)
                }
              />
              <Field
                label="About lead"
                value={draft.profile.aboutLead}
                onChange={(event) =>
                  updateProfile("aboutLead", event.target.value)
                }
              />
              <Field
                label="About paragraphs"
                textarea
                rows={6}
                className="admin-span-2"
                value={draft.profile.aboutParagraphs.join("\n")}
                onChange={(event) =>
                  updateProfile("aboutParagraphs", parseLines(event.target.value))
                }
              />
              <Field
                label="Focus areas"
                textarea
                rows={5}
                className="admin-span-2"
                value={draft.profile.focusAreas.join("\n")}
                onChange={(event) =>
                  updateProfile("focusAreas", parseLines(event.target.value))
                }
              />
            </div>
          </section>

          <section className="admin-card">
            <SectionHeader
              icon={Phone}
              title="Contact"
              description="Keep your direct contact details and media links fresh."
            />

            <div className="admin-form-grid">
              <Field
                label="Email"
                value={draft.profile.email}
                onChange={(event) => updateProfile("email", event.target.value)}
              />
              <Field
                label="Phone"
                value={draft.profile.phone}
                onChange={(event) => updateProfile("phone", event.target.value)}
              />
              <Field
                label="Location"
                value={draft.profile.location}
                onChange={(event) =>
                  updateProfile("location", event.target.value)
                }
              />
              <Field
                label="Profile image URL"
                value={draft.profile.profileImage}
                onChange={(event) =>
                  updateProfile("profileImage", event.target.value)
                }
              />
              <label className="admin-upload admin-span-2">
                <span>
                  <Upload size={14} />
                  Upload profile image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    await handleAssetUpload({
                      file,
                      maxSizeMb: 5,
                      onSuccess: (dataUrl) => updateProfile("profileImage", dataUrl),
                      onErrorMessage: "Failed to upload profile image.",
                    });
                    event.target.value = "";
                  }}
                />
                <small>JPG, PNG, WEBP up to 5MB</small>
              </label>
              {draft.profile.profileImage ? (
                <div className="admin-image-preview admin-span-2">
                  <Image size={16} />
                  <img src={draft.profile.profileImage} alt="Profile preview" />
                </div>
              ) : null}
              <Field
                label="GitHub"
                value={draft.profile.socialLinks.github}
                onChange={(event) => updateSocial("github", event.target.value)}
              />
              <Field
                label="LinkedIn"
                value={draft.profile.socialLinks.linkedin}
                onChange={(event) =>
                  updateSocial("linkedin", event.target.value)
                }
              />
              <Field
                label="Instagram"
                value={draft.profile.socialLinks.instagram}
                onChange={(event) =>
                  updateSocial("instagram", event.target.value)
                }
              />
              <Field
                label="Portfolio link"
                value={draft.profile.socialLinks.portfolio}
                onChange={(event) =>
                  updateSocial("portfolio", event.target.value)
                }
              />
              <Field
                label="WhatsApp number"
                value={draft.profile.socialLinks.whatsapp}
                onChange={(event) =>
                  updateSocial("whatsapp", event.target.value)
                }
              />
              <Field
                label="X / Twitter"
                value={draft.profile.socialLinks.x}
                onChange={(event) => updateSocial("x", event.target.value)}
              />
            </div>
          </section>

          <section className="admin-card">
            <SectionHeader
              icon={LinkIcon}
              title="Resume"
              description="Control the resume label and download link."
            />

            <div className="admin-form-grid">
              <Field
                label="Resume label"
                value={draft.resume.label || ""}
                onChange={(event) => updateResume("label", event.target.value)}
              />
              <Field
                label="Resume URL"
                value={draft.resume.fileUrl || ""}
                onChange={(event) => updateResume("fileUrl", event.target.value)}
              />
              <label className="admin-upload admin-span-2">
                <span>
                  <Upload size={14} />
                  Upload resume file
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    await handleAssetUpload({
                      file,
                      maxSizeMb: 8,
                      onSuccess: (dataUrl) => {
                        updateResume("fileUrl", dataUrl);
                        updateResume("lastUpdated", new Date().toISOString());
                      },
                      onErrorMessage: "Failed to upload resume file.",
                    });
                    event.target.value = "";
                  }}
                />
                <small>PDF up to 8MB</small>
              </label>
              {draft.resume.fileUrl ? (
                <div className="admin-file-preview admin-span-2">
                  <span>{isPdfLike(draft.resume.fileUrl) ? "PDF ready" : "Link ready"}</span>
                  <a
                    href={draft.resume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open resume preview
                  </a>
                </div>
              ) : null}
            </div>
          </section>

          <section className="admin-card admin-card-wide">
            <SectionHeader
              icon={Sparkles}
              title="Skills"
              description="Update your skill cards, levels, and short descriptions."
              action={
                <button
                  type="button"
                  className="admin-add"
                  onClick={() => addCollectionItem("skills", createEmptySkill)}
                >
                  <Plus size={16} />
                  <span>Add skill</span>
                </button>
              }
            />

            <div className="admin-stack">
              {draft.skills.map((skill, index) => (
                <article className="admin-list-card" key={skill._id}>
                  <div className="admin-list-head">
                    <div>
                      <h3>{skill.name || `Skill ${index + 1}`}</h3>
                      <p>{skill.category || "Add a category and level"}</p>
                    </div>
                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        onClick={() => moveCollectionItem("skills", index, -1)}
                        disabled={index === 0}
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCollectionItem("skills", index, 1)}
                        disabled={index === draft.skills.length - 1}
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => removeCollectionItem("skills", index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    <Field
                      label="Skill name"
                      value={skill.name}
                      onChange={(event) =>
                        updateCollectionItem("skills", index, "name", event.target.value)
                      }
                    />
                    <Field
                      label="Category"
                      value={skill.category}
                      onChange={(event) =>
                        updateCollectionItem(
                          "skills",
                          index,
                          "category",
                          event.target.value
                        )
                      }
                    />
                    <Field
                      label="Icon keyword"
                      value={skill.icon}
                      onChange={(event) =>
                        updateCollectionItem("skills", index, "icon", event.target.value)
                      }
                    />
                    <Field
                      label="Level (0-100)"
                      type="number"
                      value={skill.level}
                      onChange={(event) =>
                        updateCollectionItem(
                          "skills",
                          index,
                          "level",
                          event.target.value
                        )
                      }
                    />
                    <Field
                      label="Description"
                      textarea
                      rows={3}
                      className="admin-span-2"
                      value={skill.description}
                      onChange={(event) =>
                        updateCollectionItem(
                          "skills",
                          index,
                          "description",
                          event.target.value
                        )
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-card admin-card-wide">
            <SectionHeader
              icon={BriefcaseBusiness}
              title="Experience"
              description="Add internships, freelance work, and personal project experience."
              action={
                <button
                  type="button"
                  className="admin-add"
                  onClick={() =>
                    addCollectionItem("experience", createEmptyExperience)
                  }
                >
                  <Plus size={16} />
                  <span>Add experience</span>
                </button>
              }
            />

            <div className="admin-stack">
              {draft.experience.map((item, index) => (
                <article className="admin-list-card" key={item._id}>
                  <div className="admin-list-head">
                    <div>
                      <h3>{item.role || `Experience ${index + 1}`}</h3>
                      <p>{item.company || "Add company and timeline details"}</p>
                    </div>
                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        onClick={() => moveCollectionItem("experience", index, -1)}
                        disabled={index === 0}
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCollectionItem("experience", index, 1)}
                        disabled={index === draft.experience.length - 1}
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => removeCollectionItem("experience", index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    <Field
                      label="Role"
                      value={item.role}
                      onChange={(event) =>
                        updateCollectionItem(
                          "experience",
                          index,
                          "role",
                          event.target.value
                        )
                      }
                    />
                    <Field
                      label="Company"
                      value={item.company}
                      onChange={(event) =>
                        updateCollectionItem(
                          "experience",
                          index,
                          "company",
                          event.target.value
                        )
                      }
                    />
                    <Field
                      label="Timeline"
                      value={item.date}
                      onChange={(event) =>
                        updateCollectionItem(
                          "experience",
                          index,
                          "date",
                          event.target.value
                        )
                      }
                    />
                    <Field
                      label="Location"
                      value={item.location}
                      onChange={(event) =>
                        updateCollectionItem(
                          "experience",
                          index,
                          "location",
                          event.target.value
                        )
                      }
                    />
                    <Field
                      label="Summary"
                      textarea
                      rows={3}
                      className="admin-span-2"
                      value={item.summary}
                      onChange={(event) =>
                        updateCollectionItem(
                          "experience",
                          index,
                          "summary",
                          event.target.value
                        )
                      }
                    />
                    <Field
                      label="Tasks"
                      textarea
                      rows={5}
                      className="admin-span-2"
                      value={item.tasks.join("\n")}
                      onChange={(event) =>
                        updateCollectionItem(
                          "experience",
                          index,
                          "tasks",
                          parseLines(event.target.value)
                        )
                      }
                    />
                    <Field
                      label="Skills used"
                      textarea
                      rows={4}
                      className="admin-span-2"
                      value={item.skills.join("\n")}
                      onChange={(event) =>
                        updateCollectionItem(
                          "experience",
                          index,
                          "skills",
                          parseLines(event.target.value)
                        )
                      }
                    />
                    <Field
                      label="Reference link"
                      value={item.link}
                      onChange={(event) =>
                        updateCollectionItem(
                          "experience",
                          index,
                          "link",
                          event.target.value
                        )
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-card admin-card-wide">
            <SectionHeader
              icon={FolderKanban}
              title="Projects"
              description="Manage showcased work, live links, code links, and thumbnails."
              action={
                <button
                  type="button"
                  className="admin-add"
                  onClick={() => addCollectionItem("projects", createEmptyProject)}
                >
                  <Plus size={16} />
                  <span>Add project</span>
                </button>
              }
            />

            <div className="admin-stack">
              {draft.projects.map((project, index) => (
                <article className="admin-list-card" key={project._id}>
                  <div className="admin-list-head">
                    <div>
                      <h3>{project.title || `Project ${index + 1}`}</h3>
                      <p>
                        {project.featured ? "Featured project" : "Standard project"}
                      </p>
                    </div>
                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        onClick={() => moveCollectionItem("projects", index, -1)}
                        disabled={index === 0}
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCollectionItem("projects", index, 1)}
                        disabled={index === draft.projects.length - 1}
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => removeCollectionItem("projects", index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    <Field
                      label="Project title"
                      value={project.title}
                      onChange={(event) =>
                        updateCollectionItem(
                          "projects",
                          index,
                          "title",
                          event.target.value
                        )
                      }
                    />
                    <Field
                      label="Thumbnail URL"
                      value={project.thumbnail}
                      onChange={(event) =>
                        updateCollectionItem(
                          "projects",
                          index,
                          "thumbnail",
                          event.target.value
                        )
                      }
                    />
                    <label className="admin-upload admin-span-2">
                      <span>
                        <Upload size={14} />
                        Upload project thumbnail
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          await handleAssetUpload({
                            file,
                            maxSizeMb: 4,
                            onSuccess: (dataUrl) =>
                              updateCollectionItem(
                                "projects",
                                index,
                                "thumbnail",
                                dataUrl
                              ),
                            onErrorMessage: "Failed to upload project thumbnail.",
                          });
                          event.target.value = "";
                        }}
                      />
                      <small>JPG, PNG, WEBP up to 4MB</small>
                    </label>
                    {project.thumbnail ? (
                      <div className="admin-image-preview admin-span-2">
                        <Image size={16} />
                        <img src={project.thumbnail} alt={`${project.title || "Project"} thumbnail`} />
                      </div>
                    ) : null}
                    <Field
                      label="Description"
                      textarea
                      rows={4}
                      className="admin-span-2"
                      value={project.description}
                      onChange={(event) =>
                        updateCollectionItem(
                          "projects",
                          index,
                          "description",
                          event.target.value
                        )
                      }
                    />
                    <Field
                      label="Technologies"
                      textarea
                      rows={4}
                      className="admin-span-2"
                      value={project.technologies.join("\n")}
                      onChange={(event) =>
                        updateCollectionItem(
                          "projects",
                          index,
                          "technologies",
                          parseLines(event.target.value)
                        )
                      }
                    />
                    <Field
                      label="GitHub URL"
                      value={project.githubUrl}
                      onChange={(event) =>
                        updateCollectionItem(
                          "projects",
                          index,
                          "githubUrl",
                          event.target.value
                        )
                      }
                    />
                    <Field
                      label="Live demo URL"
                      value={project.demoUrl}
                      onChange={(event) =>
                        updateCollectionItem(
                          "projects",
                          index,
                          "demoUrl",
                          event.target.value
                        )
                      }
                    />
                    <label className="admin-toggle">
                      <input
                        type="checkbox"
                        checked={project.featured}
                        onChange={(event) =>
                          updateCollectionItem(
                            "projects",
                            index,
                            "featured",
                            event.target.checked
                          )
                        }
                      />
                      <span>Mark as featured</span>
                    </label>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-card admin-card-wide">
            <SectionHeader
              icon={Award}
              title="Certificates"
              description="Maintain issuers, issue dates, verification links, and visuals."
              action={
                <button
                  type="button"
                  className="admin-add"
                  onClick={() =>
                    addCollectionItem("certificates", createEmptyCertificate)
                  }
                >
                  <Plus size={16} />
                  <span>Add certificate</span>
                </button>
              }
            />

            <div className="admin-stack">
              {draft.certificates.map((certificate, index) => (
                <article className="admin-list-card" key={certificate._id}>
                  <div className="admin-list-head">
                    <div>
                      <h3>{certificate.title || `Certificate ${index + 1}`}</h3>
                      <p>{certificate.issuedBy || "Add issuer and verification details"}</p>
                    </div>
                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        onClick={() =>
                          moveCollectionItem("certificates", index, -1)
                        }
                        disabled={index === 0}
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          moveCollectionItem("certificates", index, 1)
                        }
                        disabled={index === draft.certificates.length - 1}
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => removeCollectionItem("certificates", index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    <Field
                      label="Certificate title"
                      value={certificate.title}
                      onChange={(event) =>
                        updateCollectionItem(
                          "certificates",
                          index,
                          "title",
                          event.target.value
                        )
                      }
                    />
                    <Field
                      label="Issued by"
                      value={certificate.issuedBy}
                      onChange={(event) =>
                        updateCollectionItem(
                          "certificates",
                          index,
                          "issuedBy",
                          event.target.value
                        )
                      }
                    />
                    <Field
                      label="Issue date"
                      type="date"
                      value={certificate.issueDate?.slice(0, 10) || ""}
                      onChange={(event) =>
                        updateCollectionItem(
                          "certificates",
                          index,
                          "issueDate",
                          event.target.value
                        )
                      }
                    />
                    <Field
                      label="Thumbnail URL"
                      value={certificate.thumbnail}
                      onChange={(event) =>
                        updateCollectionItem(
                          "certificates",
                          index,
                          "thumbnail",
                          event.target.value
                        )
                      }
                    />
                    <label className="admin-upload admin-span-2">
                      <span>
                        <Upload size={14} />
                        Upload certificate thumbnail
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          await handleAssetUpload({
                            file,
                            maxSizeMb: 4,
                            onSuccess: (dataUrl) =>
                              updateCollectionItem(
                                "certificates",
                                index,
                                "thumbnail",
                                dataUrl
                              ),
                            onErrorMessage: "Failed to upload certificate thumbnail.",
                          });
                          event.target.value = "";
                        }}
                      />
                      <small>JPG, PNG, WEBP up to 4MB</small>
                    </label>
                    {certificate.thumbnail ? (
                      <div className="admin-image-preview admin-span-2">
                        <Image size={16} />
                        <img
                          src={certificate.thumbnail}
                          alt={`${certificate.title || "Certificate"} thumbnail`}
                        />
                      </div>
                    ) : null}
                    <Field
                      label="Description"
                      textarea
                      rows={4}
                      className="admin-span-2"
                      value={certificate.description}
                      onChange={(event) =>
                        updateCollectionItem(
                          "certificates",
                          index,
                          "description",
                          event.target.value
                        )
                      }
                    />
                    <Field
                      label="Verification URL"
                      className="admin-span-2"
                      value={certificate.certificateUrl}
                      onChange={(event) =>
                        updateCollectionItem(
                          "certificates",
                          index,
                          "certificateUrl",
                          event.target.value
                        )
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <footer className="admin-footer-note">
          <ExternalLink size={16} />
          <span>
            Tip: if your backend uses `ADMIN_API_KEY`, enter the same value here before
            saving.
          </span>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
