const navLinks = [
  {
    id: 1,
    name: "Spotify",
    icon: "https://cdn.simpleicons.org/spotify/1c1c1c",
    link: "https://open.spotify.com",
  },
  {
    id: 2,
    name: "Apple Music",
    icon: "https://cdn.simpleicons.org/apple/1c1c1c",
    link: "https://music.apple.com",
  },
  {
    id: 3,
    name: "YT Music",
    icon: "https://cdn.simpleicons.org/youtubemusic/1c1c1c",
    link: "https://music.youtube.com",
  },
  {
    id: 4,
    name: "SoundCloud",
    icon: "https://cdn.simpleicons.org/soundcloud/1c1c1c",
    link: "https://soundcloud.com",
  },
  {
    id: 5,
    name: "Amazon Music",
    icon: "https://img.icons8.com/?size=100&id=xdR2e86qm3ed&format=png&color=000000",
    link: "https://music.amazon.com",
  },
];

const navIcons = [
  /* {
    id: 1,
    img: "/icons/wifi.svg",
  }, */
  {
    id: 2,
    img: "/icons/search.svg",
    type: "safari"
  },
  {
    id: 3,
    img: "/icons/music.svg",
    type: "music",
  },
  {
    id: 4,
    img: "/icons/user.svg",
    type: "finder",
    action: "about",
  },
  /* {
    id: 5,
    img: "/icons/mode.svg",
  }, */

];

const dockApps = [
  {
    id: "finder",
    name: "Portfolio", // was "Finder"
    icon: "finder.png",
    canOpen: true,
  },
  {
    id: "safari",
    name: "Discover", // was "Focus"
    icon: "safari.webp",
    canOpen: true,
  },
  {
    id: "photos",
    name: "Gallery", // was "Photos"
    icon: "photos.webp",
    canOpen: true,
  },
  {
    id: "contact",
    name: "Contact", // or "Get in touch"
    icon: "contact.webp",
    canOpen: true,
  },
  {
    id: "terminal",
    name: "Focus", // was "Skills"
    icon: "terminal.webp",
    canOpen: true,
  },
  {
    id: "vscode",
    name: "Tounge IDE",
    icon: "code2.webp",
    canOpen: true,
  },
  {
    id: "music",
    name: "Music", // was "Trash"
    icon: "music.webp",
    canOpen: true,
  },
  {
    id: "game",
    name: "Games",
    icon: "game.webp",
    canOpen: true,
  },
  {
    id: "trash", // unique id to avoid duplicate keys in Dock
    name: "Trash",
    icon: "trash.webp",
    canOpen: true,
    action: "trash",
  },
];

const blogPosts = [

  {
    id: 2,
    date: "July 5, 2025",
    title: "Mastering Frontend Performance: Speed Up Your Website",
    image: "/images/blog3.png",
    link: "https://swastiksharma15.github.io/Portfolio/blogs.html#post-4",
  },
  {
    id: 1,
    date: "June 10, 2025",
    title: "Developing Dynamic Web Experiences Using React",
    image: "/images/blog1.png",
    link: "https://swastiksharma15.github.io/Portfolio/blogs.html#post-1",
  },
  {
    id: 3,
    date: "May 20, 2025",
    title: "CSS Animations: Bringing Your Website to Life",
    image: "/images/blog2.png",
    link: "https://swastiksharma15.github.io/Portfolio/blogs.html#post-3",
  },
];

const techStack = [
  {
    category: "Languages",
    items: ["JavaScript", "Python", "SQL", "HTML", "CSS"],
  },
  {
    category: "Frontend",
    items: ["React"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express"],
  },
  {
    category: "Database",
    items: ["MongoDB"],
  },
  {
    category: "Dev Tools",
    items: ["Git", "VS Code", "Postman", "LangChain"],
  }
];

const socials = [
  {
    id: 1,
    text: "Github",
    icon: "/icons/github.svg",
    bg: "#f4656b",
    link: "https://github.com/xboybx",
  },
  {
    id: 2,
    text: "LinkedIn",
    icon: "/icons/linkedin.svg",
    bg: "#05b6f6",
    link: "https://www.linkedin.com/in/jaswanth/",
  },
  {
    id: 3,
    text: "Email",
    icon: "/icons/mail.svg",
    bg: "#4bcb63",
    link: "mailto:j.jaswanth@icloud.com",
  },
];

const photosLinks = [
  {
    id: 1,
    icon: "/icons/gicon1.svg",
    title: "Library",
  },
  {
    id: 2,
    icon: "/icons/gicon2.svg",
    title: "Memories",
  },
  {
    id: 3,
    icon: "/icons/file.svg",
    title: "Places",
  },
  {
    id: 4,
    icon: "/icons/gicon4.svg",
    title: "People",
  },
  {
    id: 5,
    icon: "/icons/gicon5.svg",
    title: "Favorites",
  },
];

const gallery = [
  { id: 1, img: "/newImages/Campsite Evening - Summer 23.jpg" },
  { id: 2, img: "/newImages/Campsite Night- Summer 23.jpg" },
  { id: 3, img: "/newImages/Last-Light.png" },
  { id: 4, img: "/newImages/Livestreamc - Summer 23.jpg" },
  { id: 5, img: "/newImages/Lofi-girl-gcoope16-9-scaled.jpg" },
  { id: 6, img: "/newImages/Map - Summer 23.jpg" },
  { id: 7, img: "/newImages/Morning Sea - Summer 23.jpg" },
  { id: 8, img: "/newImages/Sunset- Summer 23.jpg" },
  { id: 9, img: "/newImages/Time-Capsule.png" },
  { id: 10, img: "/newImages/Wave - Summer 23.jpg" }
];

const songs = [
  {
    id: 1,
    title: "Track 1",
    author: "YouTube Music",
    youtubeId: "T11lGBQw6b4",
    cover: "https://img.youtube.com/vi/T11lGBQw6b4/hqdefault.jpg",
  },
  {
    id: 2,
    title: "Track 2",
    author: "YouTube Music",
    youtubeId: "Y3SmXfJNSFc",
    cover: "https://img.youtube.com/vi/Y3SmXfJNSFc/hqdefault.jpg",
  },
  {
    id: 3,
    title: "Track 3",
    author: "YouTube Music",
    youtubeId: "totav0RSUkg",
    cover: "https://img.youtube.com/vi/totav0RSUkg/hqdefault.jpg",
  },
  {
    id: 4,
    title: "Track 4",
    author: "YouTube Music",
    youtubeId: "xRVDQK5LEpY",
    cover: "https://img.youtube.com/vi/xRVDQK5LEpY/hqdefault.jpg",
  },
  {
    id: 5,
    title: "Track 5",
    author: "YouTube Music",
    youtubeId: "6S_dfJEWT18",
    cover: "https://img.youtube.com/vi/6S_dfJEWT18/hqdefault.jpg",
  },
  {
    id: 6,
    title: "Lofi Radio",
    author: "YouTube Music",
    youtubeId: "5yx6BWlEVcY",
    cover: "https://img.youtube.com/vi/5yx6BWlEVcY/hqdefault.jpg",
  },
  {
    id: 7,
    title: "Track 7",
    author: "YouTube Music",
    youtubeId: "LuRpuxgL_kQ",
    cover: "https://img.youtube.com/vi/LuRpuxgL_kQ/hqdefault.jpg",
  }
];

export {
  navLinks,
  navIcons,
  dockApps,
  blogPosts,
  techStack,
  socials,
  photosLinks,
  gallery,
  songs,
};

const WORK_LOCATION = {
  id: 1,
  type: "work",
  name: "Work",
  icon: "/icons/work.svg",
  kind: "folder",
  children: [

    // ▶ Project 1 IRAG
    {
      id: 5,
      name: "IRAG",
      icon: "/images/folder.webp",
      kind: "folder",
      position: "top-45 right-80 ",
      windowPosition: "top-[10vh] left-15", // optional: Finder window position
      children: [
        {
          id: 1,
          name: "IRAG.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-60 right-70 ",
          description: [
            "IRAG is an AI RAG System ChatBot.",
            "Designed and built by Jaswanth to leverage Retrieval-Augmented Generation.",
          ],
        },
        {
          id: 2,
          name: "IRAG.com",
          icon: "/images/safari.webp",
          kind: "file",
          fileType: "url",
          href: "https://iragchat.vercel.app/",
          position: "top-20 left-20",
        },
        {
          id: 4,
          name: "IRAG.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-52 left-80",
          imageUrl: "/images/cyberpunk.png",
        },
        {
          id: 5,
          name: "IRAG.github",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/xboybx/IRAG-Rag-System-chatbot-",
          position: "top-5 right-10",
        },
      ],
    },

    // ▶ Project 2 COLLAB-CODE
    {
      id: 6,
      name: "COLLAB-CODE",
      icon: "/images/folder.webp",
      kind: "folder",
      position: "top-10 left-0", // icon position inside Finder
      windowPosition: "top-[25vh] left-30",
      children: [
        {
          id: 1,
          name: "COLLAB-CODE.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-52 right-80",
          description: [
            "COLLAB-CODE is a platform for developers to collaborate seamlessly.",
            "It brings multiple tools into a unified platform for better communication and sharing.",
          ],
        },
        {
          id: 2,
          name: "COLLAB-CODE.com",
          icon: "/images/safari.webp",
          kind: "file",
          fileType: "url",
          href: "https://collab-code-phi.vercel.app/",
          position: "top-5 left-10",
        },
        {
          id: 4,
          name: "COLLAB-CODE.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-65 right-30",
          imageUrl: "https://ik.imagekit.io/mtkm3escy/Portfolio%20assets/CollabCode%20banner%20wi.png?updatedAt=1775199918757",
        },
        {
          id: 5,
          name: "COLLAB-CODE.github",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/xboybx/CollabSphere.git",
          position: "top-10 right-45",
        },
      ],
    },

    // ▶ Project 3 TOUNGE
    {
      id: 7,
      name: "TOUNGE",
      icon: "/images/folder.webp",
      kind: "folder",
      position: "top-10 left-50",
      windowPosition: "top-[40vh] left-15",
      children: [
        {
          id: 1,
          name: "TOUNGE.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-67 right-85",
          description: [
            "TOUNGE is an AI Web Compiler designed to compile code on the run.",
            "With an intuitive interface, developers can quickly test and deploy code snippets.",
          ],
        },
        {
          id: 2,
          name: "TOUNGE.com",
          icon: "/images/safari.webp",
          kind: "file",
          fileType: "url",
          href: "https://tounge-webcompiler.vercel.app/",
          position: "top-25 left-30",
        },
        {
          id: 4,
          name: "TOUNGE.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-60 right-20",
          imageUrl: "https://ik.imagekit.io/mtkm3escy/IMG_9287.png?updatedAt=1771029116769",
        },
        {
          id: 5,
          name: "TOUNGE.github",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/xboybx/Tounge-webcompiler",
          position: "top-10 right-20",
        },
      ],
    },

    // ▶ Project 4 CHAT-DB
    {
      id: 8,
      name: "CHAT-DB",
      icon: "/images/folder.webp",
      kind: "folder",
      position: "top-80 right-55",
      windowPosition: "top-[55vh] left-30",
      children: [
        {
          id: 1,
          name: "CHAT-DB.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-60 right-70",
          description: [
            "CHAT-DB is a full-stack real-time chat application connecting to a database for persistent message storage.",
            "Experience seamless real-time messaging with a user-friendly interface.",
          ],
        },
        {
          id: 2,
          name: "CHAT-DB.com",
          icon: "/images/safari.webp",
          kind: "file",
          fileType: "url",
          href: "https://chatdb-p4zb.onrender.com/",
          position: "top-20 left-20",
        },
        {
          id: 4,
          name: "CHAT-DB.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-52 left-80",
          imageUrl: "https://ik.imagekit.io/mtkm3escy/Screenshot%20(257).png?updatedAt=1763832387191",
        },
        {
          id: 5,
          name: "CHAT-DB.github",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/xboybx/ChatDB.git",
          position: "top-5 right-10",
        },
      ],
    },

    // ▶ Project 5 SECURE-DOCS
    {
      id: 9,
      name: "SECURE-DOCS",
      icon: "/images/folder.webp",
      kind: "folder",
      position: "top-80 right-5",
      windowPosition: "top-[70vh] left-15",
      children: [
        {
          id: 1,
          name: "SECURE-DOCS.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-50 left-20",
          description: [
            "SECURE-DOCS provides a secure platform to store and share sensitive documents.",
            "It features end-to-end user authentication and robust document management."
          ],
        },
        {
          id: 2,
          name: "SECURE-DOCS.com",
          icon: "/images/safari.webp",
          kind: "file",
          fileType: "url",
          href: "https://secure-docs-client.onrender.com/",
          position: "top-5 left-10",
        },
        {
          id: 4,
          name: "SECURE-DOCS.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-60 right-20",
          imageUrl: "https://ik.imagekit.io/mtkm3escy/IMG_8643.png?updatedAt=1764094639249",
        },
        {
          id: 5,
          name: "SECURE-DOCS.github",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/xboybx/Secure-Docs.git",
          position: "top-15 right-30",
        },
      ],
    },

    // ▶ Project 6 LINK-MINT
    {
      id: 10,
      name: "LINK-MINT",
      icon: "/images/folder.webp",
      kind: "folder",
      position: "top-45 right-30",
      windowPosition: "top-[40vh] left-40",
      children: [
        {
          id: 1,
          name: "LINK-MINT.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-60 right-70",
          description: [
            "LINK-MINT allows users to create short links quickly and easily.",
            "It features analytics to track link usage and a simple yet effective interface."
          ],
        },
        {
          id: 2,
          name: "LINK-MINT.com",
          icon: "/images/safari.webp",
          kind: "file",
          fileType: "url",
          href: "https://custom-url-shortner-client.onrender.com/",
          position: "top-20 left-20",
        },
        {
          id: 4,
          name: "LINK-MINT.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-52 left-80",
          imageUrl: "https://ik.imagekit.io/mtkm3escy/IMG_8649.png?updatedAt=1764096599955",
        },
        {
          id: 5,
          name: "LINK-MINT.github",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/xboybx/Custom-Url-Shortner.git",
          position: "top-15 right-40",
        },
      ],
    },

    // ▶ Project 7 SUPER-MALL
    {
      id: 11,
      name: "SUPER-MALL",
      icon: "/images/folder.webp",
      kind: "folder",
      position: "top-10 right-5",
      windowPosition: "top-[10vh] left-40",
      children: [
        {
          id: 1,
          name: "SUPER-MALL.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-67 right-85",
          description: [
            "SUPER-MALL is a comprehensive e-commerce platform.",
            "It includes user authentication, shopping carts, product listings, and a smooth checkout process."
          ],
        },
        {
          id: 2,
          name: "SUPER-MALL.com",
          icon: "/images/safari.webp",
          kind: "file",
          fileType: "url",
          href: "https://supermall-webapplication-um.onrender.com/",
          position: "top-25 left-30",
        },
        {
          id: 4,
          name: "SUPER-MALL.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-60 right-20",
          imageUrl: "https://ik.imagekit.io/mtkm3escy/IMG_8650.png?updatedAt=1764108450162",
        },
        {
          id: 5,
          name: "SUPER-MALL.github",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://github.com/xboybx/SuperMall-WebApplication-UM.git",
          position: "top-10 right-20",
        },
      ],
    },
  ],
};

const ABOUT_LOCATION = {
  id: 2,
  type: "about",
  name: "About me",
  icon: "/icons/info.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "me.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-10 left-5",
      imageUrl: "https://ik.imagekit.io/mtkm3escy/protfolio%20pic.JPG?updatedAt=1763837489716",
    },
    {
      id: 2,
      name: "Jaswanth.linkedin",
      icon: "/images/safari.webp",
      kind: "file",
      fileType: "url",
      href: "https://www.linkedin.com/in/jaswanth/",
      position: "top-60 left-50",
    },
    {
      id: 3,
      name: "Jaswanth.github",
      icon: "/images/plain.png",
      kind: "file",
      fileType: "fig",
      href: "https://github.com/xboybx",
      position: "top-60 left-95",
    },
    {
      id: 4,
      name: "AboutMe.txt",
      icon: "/images/txt.png",
      kind: "file",
      fileType: "txt",
      position: "top-18 left-50",
      subtitle: "Meet the Developer Behind the Code",
      image: "https://ik.imagekit.io/mtkm3escy/protfolio%20pic.JPG?updatedAt=1763837489716",
      description: [
        "I’m Jaswanth, a forward-thinking software developer passionate about creating responsive and user-friendly applications.",
        "My experience ranges from user authentication systems to student management platforms. I value clean, maintainable code and continuous learning.",
        "Outside of coding, my interests include open-source projects and music creation.",
      ],
    },
    {
      id: 5,
      name: "TechStack.txt",
      icon: "/images/txt.png",
      kind: "file",
      fileType: "txt",
      position: "top-10 left-95",
      subtitle: "Tech Stack",
      description: [
        "⚙️ Languages:",
        "JavaScript, Python, SQL, HTML, CSS",
        "",
        "🧠 Frontend:",
        "React",
        "",
        "🛠️ Backend:",
        "Node.js, Express",
        "",
        "🎨 Database:",
        "MongoDB",
        "",
        "📡 Dev Tools:",
        "Git, VS Code, Postman, LangChain",
      ],
    },
    {
      id: 6,
      name: "me2.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-55 left-5",
      imageUrl: "https://ik.imagekit.io/mtkm3escy/protfolio%20pic.JPG?updatedAt=1763837489716",
    },
  ],
};

const RESUME_LOCATION = {
  id: 3,
  type: "resume",
  name: "Resume",
  icon: "/icons/file.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "Jeswanth_Mern_resume_2026.pdf",
      icon: "/images/pdf.png",
      kind: "file",
      fileType: "pdf",
      href: "https://ik.imagekit.io/mtkm3escy/Jeswanth_Mern_resume_2026_.pdf#view=FitH&toolbar=1&navpanes=0",
    },
  ],
};

const TRASH_LOCATION = {
  id: 4,
  type: "trash",
  name: "Trash",
  icon: "/icons/trash.svg",
  kind: "folder",
  children: [
    {
      id: 5,
      name: "Old Portfolio.com",
      icon: "/images/safari.webp",
      kind: "file",
      fileType: "url",
      href: "https://www.jjaswanth.in",
      position: "top-10 right-10",
    },
    {
      id: 6,
      name: "wallpaper.webp",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-5 left-80",
      imageUrl: "/images/wallpaper.webp",
    },
  ],
};

export const locations = {
  // work: WORK_LOCATION,
  about: ABOUT_LOCATION,
  resume: RESUME_LOCATION,
  trash: TRASH_LOCATION,
};

const INITIAL_Z_INDEX = 1000;

const WINDOW_CONFIG = {
  finder: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  contact: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  resume: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  safari: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  photos: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  terminal: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  vscode: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  txtfile: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  imgfile: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  music: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  game: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
  trash: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: INITIAL_Z_INDEX, data: null },
};

export { INITIAL_Z_INDEX, WINDOW_CONFIG };
