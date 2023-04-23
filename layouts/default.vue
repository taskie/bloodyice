<template>
  <nav class="navbar navbar-dark bg-dark">
    <div class="container-fluid">
      <NuxtLink class="navbar-brand" to="/">bloodyice</NuxtLink>
    </div>
  </nav>
  <div class="nav-scroller bg-body shadow-sm">
    <nav class="nav nav-underline" aria-label="Secondary navigation">
      <NuxtLink class="nav-link" to="/">Home</NuxtLink>
      <NuxtLink class="nav-link" to="/issues">Issues</NuxtLink>
      <NuxtLink class="nav-link" to="/settings">Settings</NuxtLink>
    </nav>
  </div>
  <main class="container">
    <slot/>
  </main>
</template>
