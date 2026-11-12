'use client';
import {useEffect,useState} from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import HomeScreen from '@/components/HomeScreen';
export default function MeridianBoot(){const[booted,setBooted]=useState(false);useEffect(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setBooted(true);return}const t=setTimeout(()=>setBooted(true),2300);return()=>clearTimeout(t)},[]);return booted?<HomeScreen/>:<LoadingScreen/>}