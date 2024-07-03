import posthog from "posthog-js";

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
    api_host: runtimeConfig.public.posthogHost || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false, // we add manual pageview capturing below
    loaded: (posthog) => {
      if (runtimeConfig.public.isDev) posthog.debug();
    },
  });

  // Make sure that pageviews are captured with each route change
  const router = useRouter();
  router.afterEach((to) => {
    nextTick(() => {
      posthog.capture("$pageview", {
        current_url: to.fullPath,
      });
    });
  });

  return {
    provide: {
      posthog: () => posthogClient,
    },
  };
});
