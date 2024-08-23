---
title: "Creation of Kunkun"
---

> Why did I create Kunkun?
> Kunkun is designed to be a cross-platform and open source alternative for apps like Alfred, Raycast, uTools. I will discuss them in this blog.

These are very successful and popular products that I have used and loved. Kunkun was created to solve some of the problems I had with these products.

## Discussion

### Cross-platform

- Alfred and Raycast are macOS only
- uTools is cross-platform but doesn't seem to have good extension support for Linux

Mac native apps usually look better than that of the native apps on Windows and Linux.
However I really wish all good apps were cross-platform.
I use all three operating systems and I want to use the same app on all of them.

Electron (used by uTools) is a popular choice for cross-platform apps, but it is controversial because of its resource usage.
Bundling a whole chromium browser and NodeJS runtime for each Electron app doesn't sound like a good idea to me.
I don't like running multiple browsers simultaneously.

### Security Concerns

- **Closed Source Applications**: All three products are closed source. Given that these applications typically require access to the entire disk, an open source alternative would be preferable for transparency and security.
- **Trust in Extensions**: When we install an application, we trust it, but do we really trust the extensions we install? Installing an extension is significantly easier than installing a regular application. Installing extensions from the extension store of an app we trust may let our guard down. You may trust the app developers, but do you trust the extension developers?
- **NodeJS Runtime Risks**: Raycast and uTools extensions run in a NodeJS runtime. Unlike Deno, NodeJS lacks a built-in sandbox to restrict access to the file system, network, etc.
- **Potential Threats**: Extensions theoretically have the same capabilities as the user. They can read/write files, steal SSH private keys from `~/.ssh`, or even grant remote access to an attacker as the extension can execute any script in NodeJS runtime.
- **NodeJS as a Double-Edged Sword**: Using NodeJS makes it easy to write powerful extensions, but it also increases the risk of exposing users to security threats.
- **Raycast’s Approach**: Raycast mitigates this issue by open-sourcing all community extensions for public review. While open-sourcing is a good practice, it is not a perfect or scalable long-term solution. Open source does not inherently guarantee security; many well-known open source projects have significant vulnerabilities.
- **Scalability and Review Challenges**: As of now, Raycast has over 1600 extensions, and the number is growing. It is challenging to review all these extensions thoroughly. Regular users lack the time and expertise to scrutinize the code of each extension they install, relying instead on the community's vigilance.
- **Proposed Solution**: There needs to be a technical solution to this problem, akin to the permission systems in mobile operating systems. Extensions should only access the resources that the user has explicitly granted permission to, utilizing a sandboxing mechanism.

### Resource Usage

#### Bundle Size

| App     | Installer Size | Installed App Size |
| ------- | -------------- | ------------------ |
| Alfred  | 5.5MB          | 17MB               |
| Raycast | 99.5MB         | 124MB              |
| uTools  | 93MB           | 220MB              |

The size is acceptable given they are extendable. The size of Alfred is actually surprisingly small given its features.

uTools is based on Electron which enables it to be cross-platform, no wonder it is so big.

I don't understand why raycast is so big as a native app. Its NodeJS runtime is not even bundled into the app itself. I remember the older version of raycast was much smaller.

### UI

- Alfred and Raycast are both native Mac apps, and look "Apple". Which is good.
- Native apps are usually more performant and look better (Mac Apps).
- However, I believe web is the future. Browser is the most important/successful cross-platform app. There are so many apps that doesn't need to be native.
  - Web/JS Ecosystem is probably the largest and most active ecosystem. One can create pretty much any complex UI with web technologies. Animation, 3D, etc.
  - Web apps are easy to develop and deploy. If I need to build native apps for all platforms, I have to be familiar with at least Swift, C++, C#, Java. Web, only JS.
  - Most importantly, for such apps, extension ecosystem is very important, and JS is the most popular language for extensions. VSCode is a good example.
- Although Raycast extensioins are written with React/JS, the app itself is not web-based. React is used as a templating engine. The benefits of web technologies are not fully utilized.

### HIC

I love the design of Raycast, which offers a hands-on keyboard experience similar to Vim. I also appreciate the flexibility of uTools, which leverages web technologies to provide a customizable UI.

Using web technologies gives developers the freedom to tailor the UI, but this can lead to inconsistent experiences across extensions since different developers may have varying design skills. Raycast, on the other hand, has a more "Apple-style" extension system where developers use a provided React template components. The app then renders native components through reconciliation, ensuring a consistent UI and interaction, but at the cost of flexibility.

Alfred's GUI for creating workflows is fantastic, especially for non-developers. It allows anyone to create their own workflows without needing programming knowledge.

Overall, balancing the flexibility of web technologies with the consistency of native rendering can greatly enhance the user experience, making the app both versatile and user-friendly.

## My Vision

I used to use Ubuntu and Windows as my main machine, and one of the main reasons I use Mac as my main machine was Alfred.
I didn't find another app as good as Alfred on Linux and Windows.
Then I found Raycast, and it's now my favorite app on Mac. It's pretty much perfect for me, but I still need to use Windows and Linux.

What I want is,

- Cross-platform (Linux, Windows, Mac) like uTools
- Open source
- Beautiful UI like Raycast
- Secure (extensions restricted by a permission system)
- Small bundle size (don't bundle a whole browser)
- Extensible (Allow users to write extensions in JS)
  - Support Raycast-style extensions (developers create extensions following a provided template) for consistent UI and interaction
  - Flexible UI: Support web-based extensions (any SPA/SSG/CSR web apps can be converted into an extension) with maximum UI flexibility
    - This means any existing open source web apps can be converted into an extension with a few lines of code.

When I explain my app to non-tech friends, I usually use the example of WeChat Mini Programs. Although I'm not a fan of WeChat, I have to admit that WeChat Mini Programs are a brilliant idea. They represent the largest-scale extension ecosystem I know of, used in everyday life by non-tech people. WeChat Mini Programs are like apps, but they are not installed. They are web apps that run within the WeChat app, offering good integration with WeChat to enable a seamless user experience.

I want to create an app that functions like WeChat Mini Programs, but for the desktop. There are many desktop apps that don't need to be native. For example, image/video converters, todo apps, file finders, video downloaders, and encoder/decoder tools for developers can all be implemented as lightweight, integrated extensions within a single desktop app, providing a unified and efficient user experience.

- If you build a native app, you have to know the native language of the platform. If you build a cross-platform app with Electron, do you really want to consume serveral hundred MBs of your precious disk space for each app (Mac disk space is like gold)?
  - To implement a very simple feature native apps with GUI usually cost at least a few MBs. The smallest Electron app costs at least ~100MB. The same features can be implemented in Kunkun with as low as 40KB.
- Tauri or Wails are good alternatives, they are small (as low as a few MB), based on web, and cross-platform, but developers have to build the entire app from scratch, which is a little more difficult than building a web app. Code signing, promotion, advertisement, etc. takes a lot of effort, and could discourage developers to write a handy tool (Remember? Developers need to pay Apple tax to code sign Mac apps, even if the app is free).
- Desktop apps lives and runs directly on the OS. Web apps run in browsers. Browsers restrict the access to the OS. What if you can install a web app as a desktop app, with access to system APIs (under a permission system of course)? That's what I want to achieve with Kunkun (Kind of like PWA, but PWA also have many limitations as of now and has a different HCI design from app launchers). I know this sounds dangerous, browsers restrict access to the OS for security reasons. There is always a trade-off between security and functionality. But I believe it is possible to create a secure system that allows web apps to access the OS in a secure way. No need to be scared. Browser extensions are a good example. They can access the OS, but they are sandboxed.

## Tech Stack

- Desktop
  - Framework: Tauri
  - Frontend: Vue & Nuxt
  - Backend: Rust
- Frontend
  - Tailwind CSS
  - shadcn-vue
- Backend
  - Server: Axum + Tonic (grpc)
- Web Server
  - Supabase: open source Firebase alternative
- Web Apps
  - Astro + Starlight: Documentation Site
  - Cloudflare pages: web app hosting
- Dev
  - pnpm workspace
  - GitHub Actions (CI/CD)
  - turbo repo (monorepo management)
  - `bun`
  - `rollup`

### Explanation

- **Tauri**
  - **Lightweight & Cross-Platform:** Tauri provides a lightweight, cross-platform framework using web technologies.
  - **Rust Backend:** Rust is fast and memory-safe, though challenging to write. It is the hardest high-level language I've encountered.
  - **Consideration for Wails:** Wails is another good alternative. Golang is much easier than rust. For this kind of app, Golang's GC is not a problem. I picked Tauri since Wails is not as mature as Tauri. Multi-window support is not stable yet. I may switch to Wails in the future if one day it becomes as good as Tauri.
  - Tauri v2 has a window-based permission system. Although this is not the only way to implement a permission system, this feature is very important for Kunkun. I may use this feature to restrict access of extensions to the OS.
- **Vue+Nuxt** is my favorite frontend stack. I am familiar with React, Vue and Svelte.
  - In terms of ecosystem, my ranking is React > Vue > Svelte.
  - In terms of the framework/language itself, my ranking is Svelte > Vue > React.
  - There is no perfect framework, and there is always a trade-off. I picked Vue because it has a mature ecosystem and is easy to use.
  - I always choose a meta-framework (Next, Nuxt, Sveltekit) rather than the vanilla framework when building a Tauri app. Metaframeworks provide lots of useful features out of the box. SSR isn't feasible for a desktop app, but other features like file-based routing, layouts, SSG, etc. are still useful. When an SPA grows, I have to do code splitting, lazy loading, etc. manually. Nuxt does this for me.
  - Nuxt also have a Nuxt Modules ecosystem, which is so handy.
  - React is probably the most future proof. If you are unsure what library you will need in the future, React is a good choice. Most UI libraries support React or have a React version.
  - But I didn't have a good experience with React and especially Next.js when writing Tauri apps. The double mounting from React 18 is so annoying. `useEffect` doesn't support async. Tauri APIs are mostly async. A listener is usually obtained with `unlisten = await listen("event_name")`. I had to write a lot more boilerplate code in React to avoid listening twice than with Vue or Svelte. Next.js throws so many errors when I was building a Tauri app (I don't remember what they were but I wasted so much time on them rather than the app logic). I also have to keep thinking about using `use client;`. In Nuxt and Sveltekit, I never need to think about whether I am in the client or server (when building a pure frontend app).
- **Rust** is nice. Fast and memory safe. Extremely hard to write, slow to build. Huge cache. (60GB accumulated for Kunkun). `node_modules` is not `heavy` at all compring to rust `target`. `target` is the heaviest object in the universe. I don't get it. I use rust because of Tauri. If Wails is as good as Tauri, I will happily switch to use Golang.
- **TailwindCSS**: I don't think I need to explain this. I simply love it.
- **Shadcn-vue**: a vue port from the original react shadcn. It's based on radix-vue. I like the styling of Shadcn and philosophy of letting user customize the components. And, I plan to support any SSG/CSR web app as an extension, which means any JS frameworks are supported. Shadcn is based on React, and there is ports for Vue and Svelte, with the same styling. It's simpler to keep extension UI styling consistent with the app UI styling if shadcn is used.
- Axum+Tonic is probably the best choice in rust to support regular HTTP server and gRPC server together. I want to use gRPC because of its proto can guarantee the compatibility between the client and server. Reflection server is also easy for development, kind of like graphql.
