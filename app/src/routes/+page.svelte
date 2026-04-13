<script lang="ts">
  import { fade, fly } from 'svelte/transition';

  const vibes = [
    { name: 'Study', color: 'bg-[#FFD97D]', delay: 200, rotate: '-rotate-3', emoji: '📚' },
    { name: 'Relax', color: 'bg-[#A8E6CF]', delay: 400, rotate: 'rotate-2', emoji: '🍵' },
    { name: 'Party', color: 'bg-[#FFB7B2]', delay: 600, rotate: '-rotate-6', emoji: '🪩' }
  ];
</script>

<svelte:head>
  <title>wohin — The Radiant Curator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,700;0,800;1,400&display=swap" rel="stylesheet">
</svelte:head>

<main class="min-h-screen bg-[#fefcf4] text-[#2c2b29] overflow-hidden selection:bg-[#FFD97D] selection:text-black font-['Be_Vietnam_Pro',sans-serif]">
  
  <!-- Abstract tonal background blobs - No-Border Rule implementation -->
  <div class="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#FFD97D] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 z-0 animate-blob"></div>
  <div class="fixed top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-[#FFB7B2] rounded-full mix-blend-multiply filter blur-[120px] opacity-50 z-0 animate-blob animation-delay-2000"></div>
  <div class="fixed bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-[#A8E6CF] rounded-full mix-blend-multiply filter blur-[150px] opacity-40 z-0 animate-blob animation-delay-4000"></div>

  <div class="relative z-10 container mx-auto px-6 py-12 md:py-24 max-w-6xl">
    
    <!-- Navigation -->
    <nav class="flex justify-between items-center mb-24 md:mb-32">
        <div in:fly={{ y: -20, duration: 800, delay: 100 }} class="text-2xl md:text-3xl font-extrabold tracking-tighter font-['Plus_Jakarta_Sans',sans-serif] uppercase">
          wohin.
        </div>
        <div in:fly={{ y: -20, duration: 800, delay: 200 }} class="flex gap-6 items-center">
          <a href="/home" class="text-sm md:text-base font-medium tracking-wide hover:opacity-60 transition-opacity">Explore</a>
          <a href="/home" class="px-6 py-3 bg-[#2c2b29] text-[#fefcf4] rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#FFD97D] hover:text-[#2c2b29] transition-colors duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            Open App
          </a>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="mb-32 md:mb-48 flex flex-col md:flex-row items-center gap-12 md:gap-24">
      <div class="md:w-1/2">
          <div in:fade={{ duration: 1000, delay: 300 }} class="inline-block px-4 py-2 bg-white/50 backdrop-blur-md rounded-2xl mb-6 text-sm font-semibold tracking-widest uppercase text-[#8b8a87]">
            Your Next Destination
          </div>
          <h1 in:fly={{ y: 30, duration: 1000, delay: 400 }} class="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 font-['Plus_Jakarta_Sans',sans-serif]">
            Find your <br/>
            <span class="relative inline-block mt-2">
              <span class="relative z-10">perfect vibe.</span>
              <span class="absolute bottom-2 left-0 w-full h-4 bg-[#FFD97D] -z-10 rounded-full opacity-80 transform -rotate-1"></span>
            </span>
          </h1>
          <p in:fly={{ y: 30, duration: 1000, delay: 500 }} class="text-xl md:text-2xl font-light leading-relaxed mb-10 max-w-lg text-[#5a5957]">
            Wohin is a radically curated, delightfully social discovery engine for the places you actually want to be. Drop the generic reviews and find locations based on exactly what you want to do.
          </p>
          <div in:fly={{ y: 30, duration: 1000, delay: 600 }}>
            <a href="/home" class="group inline-flex items-center gap-4 px-8 py-4 bg-[#FFB7B2] text-[#2c2b29] rounded-full font-bold text-lg hover:bg-[#2c2b29] hover:text-[#fefcf4] transition-all duration-300 shadow-[0_10px_40px_rgba(255,183,178,0.4)]">
              Start Discovering
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
      </div>

      <!-- Floating Vibe Cards -->
      <div class="md:w-1/2 relative h-[400px] w-full mt-12 md:mt-0">
          {#each vibes as vibe, i}
            <div in:fly={{ y: 50, duration: 800, delay: vibe.delay + 600 }} 
                 class="absolute w-48 h-48 md:w-64 md:h-64 {vibe.color} rounded-3xl p-6 flex flex-col justify-between shadow-2xl backdrop-blur-sm bg-opacity-90 transform {vibe.rotate} hover:scale-105 hover:rotate-0 transition-transform duration-500 cursor-default"
                 style="top: {i * 15}%; left: {i * 20}%; z-index: {10 - i};">
              <div class="text-4xl md:text-6xl">{vibe.emoji}</div>
              <div class="text-2xl md:text-3xl font-bold font-['Plus_Jakarta_Sans',sans-serif]">{vibe.name}</div>
            </div>
          {/each}
      </div>
    </section>

    <!-- Features Section -->
    <section in:fade={{ duration: 1000, delay: 1000 }} class="py-24 border-t-2 border-[#2c2b29]/5">
        <h2 class="text-4xl md:text-5xl font-extrabold mb-16 text-center font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">The Radiant Curator</h2>
        
        <div class="grid md:grid-cols-3 gap-12">
          
          <div class="bg-white/40 backdrop-blur-xl p-10 rounded-[2.5rem] hover:bg-white/60 transition-colors duration-500 group shadow-[0_15px_45px_rgba(0,0,0,0.03)]">
            <div class="w-16 h-16 bg-[#FFD97D] rounded-2xl mb-8 flex items-center justify-center text-3xl transform group-hover:rotate-12 transition-transform shadow-lg">☕</div>
            <h3 class="text-2xl font-bold mb-4 font-['Plus_Jakarta_Sans',sans-serif]">Activity First</h3>
            <p class="text-[#5a5957] leading-relaxed">
              Don't search for "coffee shops". Search for "study spots". Wohin curates places based on the intention behind your visit.
            </p>
          </div>

          <div class="bg-white/40 backdrop-blur-xl p-10 rounded-[2.5rem] hover:bg-white/60 transition-colors duration-500 group shadow-[0_15px_45px_rgba(0,0,0,0.03)]">
            <div class="w-16 h-16 bg-[#A8E6CF] rounded-2xl mb-8 flex items-center justify-center text-3xl transform group-hover:-rotate-12 transition-transform shadow-lg">✨</div>
            <h3 class="text-2xl font-bold mb-4 font-['Plus_Jakarta_Sans',sans-serif]">The Vibe Check</h3>
            <p class="text-[#5a5957] leading-relaxed">
              Drop playful, animated vibe checks to let others know if a spot is truly matching the energy. Contribute to the pulse of the community.
            </p>
          </div>

          <div class="bg-white/40 backdrop-blur-xl p-10 rounded-[2.5rem] hover:bg-white/60 transition-colors duration-500 group shadow-[0_15px_45px_rgba(0,0,0,0.03)]">
            <div class="w-16 h-16 bg-[#FFB7B2] rounded-2xl mb-8 flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform shadow-lg">📱</div>
            <h3 class="text-2xl font-bold mb-4 font-['Plus_Jakarta_Sans',sans-serif]">Native Feel</h3>
            <p class="text-[#5a5957] leading-relaxed">
              A Progressive Web App that feels right at home on your device. Fast, installable, and ready to go wherever you are.
            </p>
          </div>

        </div>
      </section>

    <!-- Footer -->
    <footer class="py-12 text-center text-[#8b8a87] font-medium text-sm">
      <p>© {new Date().getFullYear()} Wohin. The Sun-Drenched Social Edition.</p>
    </footer>

  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #fefcf4;
  }

  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }

  .animate-blob {
    animation: blob 15s infinite alternate;
  }

  .animation-delay-2000 {
    animation-delay: 2s;
  }

  .animation-delay-4000 {
    animation-delay: 4s;
  }
</style>