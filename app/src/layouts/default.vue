<template>
  <div>
    <header>
      <User />
      <ul>
        <li><nuxt-link to="/">Home</nuxt-link></li>
        <li><nuxt-link to="/guarded">Super-secret</nuxt-link></li>
      </ul>
    </header>
    <div>
      <slot />
    </div>
  </div>
</template>
