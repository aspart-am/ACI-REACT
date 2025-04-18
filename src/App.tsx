import React from 'react'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-primary text-primary-foreground p-4">
        <h1 className="text-2xl font-bold">ACI React App</h1>
      </header>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={
            <div className="p-4 bg-card text-card-foreground rounded-lg shadow">
