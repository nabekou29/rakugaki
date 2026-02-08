local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable", -- latest stable release
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

local opts = {
  dev = {
    path = vim.fn.systemlist("ghq root")[1] .. "/github.com/nabekou29",
    patterns = { "nabekou29" },
    fallback = true,
  },
}

require("lazy").setup({
  {
    "nabekou29/example.nvim",
    opts = {
      message = "Hello, world !",
    },
  },
}, opts)
