<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="danger">
      <b-navbar-brand to="/">bloodyice</b-navbar-brand>
    </b-navbar>
    <b-container>
      <b-row class="my-3">
        <b-col>
          <b-nav>
            <b-nav-item to="/">Time Card</b-nav-item>
            <b-nav-item to="/issues">Issues</b-nav-item>
            <b-nav-item to="/servers">Servers</b-nav-item>
          </b-nav>
          <hr />
          <nuxt />
          <hr />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
