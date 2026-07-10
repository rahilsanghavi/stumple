import React, { useState, useMemo, useRef, useEffect } from "react";

// ---------------------------------------------------------------
// DATA — ~320 men's international cricketers from the ten major
// Test-playing nations, spanning the 1980s through today.
// "debut" = year of international debut (any format) — a stable
// biographical fact. Legends whose careers straddled 1980 are
// included; South Africa's earliest entries start ~1991 (their
// return from international isolation).
// Confidence is high for these well-documented players, but this
// is still hand-compiled — worth a spot-check pass before public
// launch, especially exact debut years for 1980s-90s figures.
// ---------------------------------------------------------------
const PLAYERS = [
  // ===== INDIA (49) =====
  { name: "Virat Kohli", country: "India", role: "Batsman", bats: "Right", bowls: "Right-arm medium", debut: 2008, born: 1988 },
  { name: "Rohit Sharma", country: "India", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2007, born: 1987 },
  { name: "Jasprit Bumrah", country: "India", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2016, born: 1993 },
  { name: "MS Dhoni", country: "India", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 2004, born: 1981 },
  { name: "Ravindra Jadeja", country: "India", role: "All-rounder", bats: "Left", bowls: "Left-arm orthodox", debut: 2009, born: 1988 },
  { name: "Suryakumar Yadav", country: "India", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2021, born: 1990 },
  { name: "Shubman Gill", country: "India", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2019, born: 1999 },
  { name: "Rishabh Pant", country: "India", role: "WK-Batsman", bats: "Left", bowls: "None", debut: 2017, born: 1997 },
  { name: "Hardik Pandya", country: "India", role: "All-rounder", bats: "Right", bowls: "Right-arm fast-medium", debut: 2016, born: 1993 },
  { name: "Shreyas Iyer", country: "India", role: "Batsman", bats: "Right", bowls: "Right-arm leg break", debut: 2017, born: 1994 },
  { name: "Yashasvi Jaiswal", country: "India", role: "Batsman", bats: "Left", bowls: "Right-arm leg break", debut: 2022, born: 2001 },
  { name: "KL Rahul", country: "India", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 2016, born: 1992 },
  { name: "Mohammad Shami", country: "India", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2013, born: 1990 },
  { name: "Arshdeep Singh", country: "India", role: "Bowler", bats: "Left", bowls: "Left-arm fast-medium", debut: 2022, born: 1999 },
  { name: "Ravichandran Ashwin", country: "India", role: "Bowler", bats: "Right", bowls: "Right-arm off break", debut: 2010, born: 1986 },
  { name: "Sanju Samson", country: "India", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 2015, born: 1994 },
  { name: "Ruturaj Gaikwad", country: "India", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2021, born: 1997 },
  { name: "Kuldeep Yadav", country: "India", role: "Bowler", bats: "Left", bowls: "Left-arm wrist spin", debut: 2017, born: 1994 },
  { name: "Mayank Yadav", country: "India", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2024, born: 2001 },
  { name: "Axar Patel", country: "India", role: "All-rounder", bats: "Left", bowls: "Left-arm orthodox", debut: 2014, born: 1994 },
  { name: "Cheteshwar Pujara", country: "India", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2010, born: 1988 },
  { name: "Ajinkya Rahane", country: "India", role: "Batsman", bats: "Right", bowls: "Right-arm medium", debut: 2011, born: 1988 },
  { name: "Mohammed Siraj", country: "India", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2017, born: 1994 },
  { name: "Washington Sundar", country: "India", role: "All-rounder", bats: "Right", bowls: "Right-arm off break", debut: 2017, born: 1999 },
  { name: "Ishan Kishan", country: "India", role: "WK-Batsman", bats: "Left", bowls: "None", debut: 2016, born: 1998 },
  { name: "Deepak Chahar", country: "India", role: "Bowler", bats: "Right", bowls: "Right-arm medium-fast", debut: 2018, born: 1992 },
  { name: "Shardul Thakur", country: "India", role: "Bowler", bats: "Right", bowls: "Right-arm fast-medium", debut: 2017, born: 1991 },
  { name: "Prasidh Krishna", country: "India", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2021, born: 1997 },
  { name: "Yuzvendra Chahal", country: "India", role: "Bowler", bats: "Right", bowls: "Right-arm leg break", debut: 2016, born: 1990 },
  { name: "Rinku Singh", country: "India", role: "Batsman", bats: "Left", bowls: "None", debut: 2023, born: 1997 },
  { name: "Sachin Tendulkar", country: "India", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 1989, born: 1973 },
  { name: "Sunil Gavaskar", country: "India", role: "Batsman", bats: "Right", bowls: "None", debut: 1971, born: 1949 },
  { name: "Kapil Dev", country: "India", role: "All-rounder", bats: "Right", bowls: "Right-arm fast-medium", debut: 1978, born: 1959 },
  { name: "Rahul Dravid", country: "India", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 1996, born: 1973 },
  { name: "Sourav Ganguly", country: "India", role: "Batsman", bats: "Left", bowls: "Right-arm medium", debut: 1992, born: 1972 },
  { name: "Anil Kumble", country: "India", role: "Bowler", bats: "Right", bowls: "Right-arm leg break", debut: 1990, born: 1970 },
  { name: "VVS Laxman", country: "India", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 1996, born: 1974 },
  { name: "Virender Sehwag", country: "India", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 1999, born: 1978 },
  { name: "Zaheer Khan", country: "India", role: "Bowler", bats: "Left", bowls: "Left-arm fast-medium", debut: 2000, born: 1978 },
  { name: "Harbhajan Singh", country: "India", role: "Bowler", bats: "Right", bowls: "Right-arm off break", debut: 1998, born: 1980 },
  { name: "Yuvraj Singh", country: "India", role: "All-rounder", bats: "Left", bowls: "Left-arm orthodox", debut: 2000, born: 1981 },
  { name: "Gautam Gambhir", country: "India", role: "Batsman", bats: "Left", bowls: "None", debut: 2003, born: 1981 },
  { name: "Mohammad Azharuddin", country: "India", role: "Batsman", bats: "Right", bowls: "None", debut: 1984, born: 1963 },
  { name: "Ravi Shastri", country: "India", role: "All-rounder", bats: "Left", bowls: "Right-arm off break", debut: 1981, born: 1962 },
  { name: "Dilip Vengsarkar", country: "India", role: "Batsman", bats: "Right", bowls: "None", debut: 1976, born: 1956 },
  { name: "Mohinder Amarnath", country: "India", role: "All-rounder", bats: "Right", bowls: "Right-arm medium", debut: 1969, born: 1950 },
  { name: "Javagal Srinath", country: "India", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 1991, born: 1969 },
  { name: "Ajit Agarkar", country: "India", role: "Bowler", bats: "Right", bowls: "Right-arm fast-medium", debut: 1998, born: 1977 },
  { name: "Suresh Raina", country: "India", role: "Batsman", bats: "Left", bowls: "Right-arm off break", debut: 2005, born: 1986 },

  // ===== AUSTRALIA (40) =====
  { name: "Steve Smith", country: "Australia", role: "Batsman", bats: "Right", bowls: "Right-arm leg break", debut: 2010, born: 1989 },
  { name: "Pat Cummins", country: "Australia", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2011, born: 1993 },
  { name: "David Warner", country: "Australia", role: "Batsman", bats: "Left", bowls: "Right-arm leg break", debut: 2009, born: 1986 },
  { name: "Glenn Maxwell", country: "Australia", role: "All-rounder", bats: "Right", bowls: "Right-arm off break", debut: 2012, born: 1988 },
  { name: "Travis Head", country: "Australia", role: "Batsman", bats: "Left", bowls: "Right-arm off break", debut: 2016, born: 1993 },
  { name: "Mitchell Starc", country: "Australia", role: "Bowler", bats: "Left", bowls: "Left-arm fast", debut: 2010, born: 1990 },
  { name: "Josh Hazlewood", country: "Australia", role: "Bowler", bats: "Right", bowls: "Right-arm fast-medium", debut: 2010, born: 1991 },
  { name: "Cameron Green", country: "Australia", role: "All-rounder", bats: "Right", bowls: "Right-arm fast-medium", debut: 2021, born: 2000 },
  { name: "Marcus Stoinis", country: "Australia", role: "All-rounder", bats: "Right", bowls: "Right-arm medium", debut: 2015, born: 1989 },
  { name: "Mitchell Marsh", country: "Australia", role: "All-rounder", bats: "Right", bowls: "Right-arm medium", debut: 2011, born: 1991 },
  { name: "Adam Zampa", country: "Australia", role: "Bowler", bats: "Right", bowls: "Right-arm leg break", debut: 2016, born: 1992 },
  { name: "Marnus Labuschagne", country: "Australia", role: "Batsman", bats: "Right", bowls: "Right-arm leg break", debut: 2018, born: 1994 },
  { name: "Alex Carey", country: "Australia", role: "WK-Batsman", bats: "Left", bowls: "None", debut: 2018, born: 1991 },
  { name: "Nathan Lyon", country: "Australia", role: "Bowler", bats: "Right", bowls: "Right-arm off break", debut: 2011, born: 1987 },
  { name: "Josh Inglis", country: "Australia", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 2021, born: 1995 },
  { name: "Matthew Wade", country: "Australia", role: "WK-Batsman", bats: "Left", bowls: "None", debut: 2012, born: 1987 },
  { name: "Ashton Agar", country: "Australia", role: "All-rounder", bats: "Left", bowls: "Left-arm orthodox", debut: 2013, born: 1993 },
  { name: "Sean Abbott", country: "Australia", role: "Bowler", bats: "Right", bowls: "Right-arm fast-medium", debut: 2014, born: 1992 },
  { name: "Tim David", country: "Australia", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2021, born: 1996 },
  { name: "Aaron Finch", country: "Australia", role: "Batsman", bats: "Right", bowls: "Right-arm break", debut: 2013, born: 1986 },
  { name: "Jhye Richardson", country: "Australia", role: "Bowler", bats: "Right", bowls: "Right-arm fast-medium", debut: 2019, born: 1996 },
  { name: "Spencer Johnson", country: "Australia", role: "Bowler", bats: "Left", bowls: "Left-arm fast", debut: 2024, born: 1996 },
  { name: "Allan Border", country: "Australia", role: "Batsman", bats: "Left", bowls: "Left-arm orthodox", debut: 1978, born: 1955 },
  { name: "Steve Waugh", country: "Australia", role: "All-rounder", bats: "Right", bowls: "Right-arm medium", debut: 1985, born: 1965 },
  { name: "Mark Waugh", country: "Australia", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 1991, born: 1965 },
  { name: "Ricky Ponting", country: "Australia", role: "Batsman", bats: "Right", bowls: "Right-arm medium", debut: 1995, born: 1974 },
  { name: "Adam Gilchrist", country: "Australia", role: "WK-Batsman", bats: "Left", bowls: "None", debut: 1996, born: 1971 },
  { name: "Shane Warne", country: "Australia", role: "Bowler", bats: "Right", bowls: "Right-arm leg break", debut: 1992, born: 1969 },
  { name: "Glenn McGrath", country: "Australia", role: "Bowler", bats: "Right", bowls: "Right-arm fast-medium", debut: 1993, born: 1970 },
  { name: "Michael Clarke", country: "Australia", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2003, born: 1981 },
  { name: "Brett Lee", country: "Australia", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 1999, born: 1976 },
  { name: "Matthew Hayden", country: "Australia", role: "Batsman", bats: "Left", bowls: "None", debut: 1993, born: 1971 },
  { name: "Justin Langer", country: "Australia", role: "Batsman", bats: "Left", bowls: "None", debut: 1993, born: 1970 },
  { name: "Michael Hussey", country: "Australia", role: "Batsman", bats: "Left", bowls: "Right-arm medium", debut: 2004, born: 1975 },
  { name: "Damien Martyn", country: "Australia", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 1992, born: 1971 },
  { name: "Craig McDermott", country: "Australia", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 1984, born: 1965 },
  { name: "Dennis Lillee", country: "Australia", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 1971, born: 1949 },
  { name: "Kim Hughes", country: "Australia", role: "Batsman", bats: "Right", bowls: "None", debut: 1977, born: 1954 },
  { name: "Michael Bevan", country: "Australia", role: "Batsman", bats: "Left", bowls: "Left-arm wrist spin", debut: 1994, born: 1970 },
  { name: "Andrew Symonds", country: "Australia", role: "All-rounder", bats: "Right", bowls: "Right-arm off break", debut: 1998, born: 1975 },

  // ===== ENGLAND (38) =====
  { name: "Ben Stokes", country: "England", role: "All-rounder", bats: "Left", bowls: "Right-arm fast-medium", debut: 2011, born: 1991 },
  { name: "Joe Root", country: "England", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2012, born: 1990 },
  { name: "Jos Buttler", country: "England", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 2011, born: 1990 },
  { name: "Harry Brook", country: "England", role: "Batsman", bats: "Right", bowls: "Right-arm medium", debut: 2022, born: 1999 },
  { name: "Jofra Archer", country: "England", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2019, born: 1995 },
  { name: "Liam Livingstone", country: "England", role: "All-rounder", bats: "Right", bowls: "Right-arm off break", debut: 2017, born: 1993 },
  { name: "Mark Wood", country: "England", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2015, born: 1990 },
  { name: "Moeen Ali", country: "England", role: "All-rounder", bats: "Left", bowls: "Right-arm off break", debut: 2014, born: 1987 },
  { name: "Jonny Bairstow", country: "England", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 2011, born: 1989 },
  { name: "Adil Rashid", country: "England", role: "Bowler", bats: "Right", bowls: "Right-arm leg break", debut: 2009, born: 1988 },
  { name: "Chris Woakes", country: "England", role: "All-rounder", bats: "Right", bowls: "Right-arm fast-medium", debut: 2011, born: 1989 },
  { name: "Sam Curran", country: "England", role: "All-rounder", bats: "Left", bowls: "Left-arm fast-medium", debut: 2018, born: 1998 },
  { name: "Jason Roy", country: "England", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2013, born: 1990 },
  { name: "Dawid Malan", country: "England", role: "Batsman", bats: "Left", bowls: "Right-arm leg break", debut: 2017, born: 1987 },
  { name: "Reece Topley", country: "England", role: "Bowler", bats: "Left", bowls: "Left-arm fast-medium", debut: 2015, born: 1994 },
  { name: "Phil Salt", country: "England", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 2021, born: 1996 },
  { name: "Will Jacks", country: "England", role: "All-rounder", bats: "Right", bowls: "Right-arm off break", debut: 2022, born: 1998 },
  { name: "Zak Crawley", country: "England", role: "Batsman", bats: "Right", bowls: "None", debut: 2019, born: 1998 },
  { name: "Ollie Pope", country: "England", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2018, born: 1998 },
  { name: "Brydon Carse", country: "England", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2024, born: 1995 },
  { name: "Ian Botham", country: "England", role: "All-rounder", bats: "Right", bowls: "Right-arm fast-medium", debut: 1974, born: 1955 },
  { name: "Graham Gooch", country: "England", role: "Batsman", bats: "Right", bowls: "Right-arm medium", debut: 1975, born: 1953 },
  { name: "David Gower", country: "England", role: "Batsman", bats: "Left", bowls: "None", debut: 1978, born: 1957 },
  { name: "Michael Atherton", country: "England", role: "Batsman", bats: "Right", bowls: "Right-arm leg break", debut: 1989, born: 1968 },
  { name: "Alec Stewart", country: "England", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 1989, born: 1963 },
  { name: "Andrew Flintoff", country: "England", role: "All-rounder", bats: "Right", bowls: "Right-arm fast-medium", debut: 1998, born: 1977 },
  { name: "Kevin Pietersen", country: "England", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2004, born: 1980 },
  { name: "Alastair Cook", country: "England", role: "Batsman", bats: "Left", bowls: "None", debut: 2006, born: 1984 },
  { name: "James Anderson", country: "England", role: "Bowler", bats: "Right", bowls: "Right-arm fast-medium", debut: 2002, born: 1982 },
  { name: "Stuart Broad", country: "England", role: "Bowler", bats: "Right", bowls: "Right-arm fast-medium", debut: 2007, born: 1986 },
  { name: "Graeme Swann", country: "England", role: "Bowler", bats: "Right", bowls: "Right-arm off break", debut: 2000, born: 1979 },
  { name: "Eoin Morgan", country: "England", role: "Batsman", bats: "Left", bowls: "None", debut: 2006, born: 1986 },
  { name: "Nasser Hussain", country: "England", role: "Batsman", bats: "Right", bowls: "Right-arm medium", debut: 1990, born: 1968 },
  { name: "Marcus Trescothick", country: "England", role: "Batsman", bats: "Left", bowls: "Right-arm medium", debut: 2000, born: 1977 },
  { name: "Jonathan Trott", country: "England", role: "Batsman", bats: "Right", bowls: "Right-arm medium", debut: 2009, born: 1981 },
  { name: "Darren Gough", country: "England", role: "Bowler", bats: "Right", bowls: "Right-arm fast-medium", debut: 1994, born: 1970 },
  { name: "Angus Fraser", country: "England", role: "Bowler", bats: "Right", bowls: "Right-arm medium-fast", debut: 1989, born: 1965 },
  { name: "Robin Smith", country: "England", role: "Batsman", bats: "Right", bowls: "None", debut: 1988, born: 1963 },

  // ===== PAKISTAN (34) =====
  { name: "Babar Azam", country: "Pakistan", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2015, born: 1994 },
  { name: "Shaheen Afridi", country: "Pakistan", role: "Bowler", bats: "Left", bowls: "Left-arm fast", debut: 2018, born: 1999 },
  { name: "Mohammad Rizwan", country: "Pakistan", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 2015, born: 1992 },
  { name: "Shadab Khan", country: "Pakistan", role: "All-rounder", bats: "Right", bowls: "Right-arm leg break", debut: 2017, born: 1998 },
  { name: "Naseem Shah", country: "Pakistan", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2020, born: 2003 },
  { name: "Fakhar Zaman", country: "Pakistan", role: "Batsman", bats: "Left", bowls: "Right-arm off break", debut: 2017, born: 1990 },
  { name: "Haris Rauf", country: "Pakistan", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2020, born: 1993 },
  { name: "Imad Wasim", country: "Pakistan", role: "All-rounder", bats: "Left", bowls: "Left-arm orthodox", debut: 2015, born: 1988 },
  { name: "Mohammad Nawaz", country: "Pakistan", role: "All-rounder", bats: "Left", bowls: "Left-arm orthodox", debut: 2016, born: 1994 },
  { name: "Iftikhar Ahmed", country: "Pakistan", role: "All-rounder", bats: "Right", bowls: "Right-arm off break", debut: 2015, born: 1989 },
  { name: "Saud Shakeel", country: "Pakistan", role: "Batsman", bats: "Left", bowls: "None", debut: 2022, born: 1998 },
  { name: "Abrar Ahmed", country: "Pakistan", role: "Bowler", bats: "Right", bowls: "Right-arm leg break", debut: 2022, born: 1998 },
  { name: "Mohammad Wasim Jr", country: "Pakistan", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2019, born: 2000 },
  { name: "Usman Khan", country: "Pakistan", role: "Batsman", bats: "Right", bowls: "None", debut: 2024, born: 1998 },
  { name: "Azam Khan", country: "Pakistan", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 2021, born: 1996 },
  { name: "Faheem Ashraf", country: "Pakistan", role: "All-rounder", bats: "Left", bowls: "Right-arm fast-medium", debut: 2016, born: 1994 },
  { name: "Khushdil Shah", country: "Pakistan", role: "All-rounder", bats: "Left", bowls: "Right-arm leg break", debut: 2019, born: 1994 },
  { name: "Zaman Khan", country: "Pakistan", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2023, born: 2000 },
  { name: "Imran Khan", country: "Pakistan", role: "All-rounder", bats: "Right", bowls: "Right-arm fast", debut: 1971, born: 1952 },
  { name: "Javed Miandad", country: "Pakistan", role: "Batsman", bats: "Right", bowls: "Right-arm leg break", debut: 1976, born: 1957 },
  { name: "Wasim Akram", country: "Pakistan", role: "Bowler", bats: "Left", bowls: "Left-arm fast", debut: 1984, born: 1966 },
  { name: "Waqar Younis", country: "Pakistan", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 1989, born: 1971 },
  { name: "Inzamam-ul-Haq", country: "Pakistan", role: "Batsman", bats: "Right", bowls: "None", debut: 1991, born: 1970 },
  { name: "Saeed Anwar", country: "Pakistan", role: "Batsman", bats: "Left", bowls: "None", debut: 1989, born: 1968 },
  { name: "Shahid Afridi", country: "Pakistan", role: "All-rounder", bats: "Right", bowls: "Right-arm leg break", debut: 1996, born: 1980 },
  { name: "Younis Khan", country: "Pakistan", role: "Batsman", bats: "Right", bowls: "None", debut: 1998, born: 1977 },
  { name: "Mohammad Yousuf", country: "Pakistan", role: "Batsman", bats: "Right", bowls: "None", debut: 1998, born: 1974 },
  { name: "Abdul Qadir", country: "Pakistan", role: "Bowler", bats: "Right", bowls: "Right-arm leg break", debut: 1977, born: 1955 },
  { name: "Zaheer Abbas", country: "Pakistan", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 1969, born: 1947 },
  { name: "Moin Khan", country: "Pakistan", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 1990, born: 1971 },
  { name: "Misbah-ul-Haq", country: "Pakistan", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2001, born: 1974 },
  { name: "Mohammad Amir", country: "Pakistan", role: "Bowler", bats: "Left", bowls: "Left-arm fast", debut: 2009, born: 1992 },
  { name: "Sarfaraz Ahmed", country: "Pakistan", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 2007, born: 1987 },
  { name: "Shoaib Akhtar", country: "Pakistan", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 1997, born: 1975 },

  // ===== SOUTH AFRICA (34) =====
  { name: "Aiden Markram", country: "South Africa", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2016, born: 1994 },
  { name: "Kagiso Rabada", country: "South Africa", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2015, born: 1995 },
  { name: "Quinton de Kock", country: "South Africa", role: "WK-Batsman", bats: "Left", bowls: "None", debut: 2013, born: 1992 },
  { name: "Heinrich Klaasen", country: "South Africa", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 2019, born: 1991 },
  { name: "Marco Jansen", country: "South Africa", role: "All-rounder", bats: "Left", bowls: "Left-arm fast-medium", debut: 2022, born: 2000 },
  { name: "Anrich Nortje", country: "South Africa", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2019, born: 1993 },
  { name: "David Miller", country: "South Africa", role: "Batsman", bats: "Left", bowls: "None", debut: 2010, born: 1989 },
  { name: "Tabraiz Shamsi", country: "South Africa", role: "Bowler", bats: "Left", bowls: "Left-arm wrist spin", debut: 2017, born: 1990 },
  { name: "Temba Bavuma", country: "South Africa", role: "Batsman", bats: "Right", bowls: "None", debut: 2014, born: 1990 },
  { name: "Lungi Ngidi", country: "South Africa", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2017, born: 1996 },
  { name: "Rassie van der Dussen", country: "South Africa", role: "Batsman", bats: "Right", bowls: "Right-arm medium", debut: 2018, born: 1989 },
  { name: "Wiaan Mulder", country: "South Africa", role: "All-rounder", bats: "Right", bowls: "Right-arm fast-medium", debut: 2021, born: 1998 },
  { name: "Keshav Maharaj", country: "South Africa", role: "Bowler", bats: "Left", bowls: "Left-arm orthodox", debut: 2016, born: 1990 },
  { name: "Gerald Coetzee", country: "South Africa", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2023, born: 2000 },
  { name: "Reeza Hendricks", country: "South Africa", role: "Batsman", bats: "Right", bowls: "None", debut: 2016, born: 1990 },
  { name: "Tristan Stubbs", country: "South Africa", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2023, born: 2000 },
  { name: "Dewald Brevis", country: "South Africa", role: "Batsman", bats: "Right", bowls: "Right-arm leg break", debut: 2023, born: 2003 },
  { name: "Ryan Rickelton", country: "South Africa", role: "WK-Batsman", bats: "Left", bowls: "None", debut: 2023, born: 1996 },
  { name: "Hansie Cronje", country: "South Africa", role: "All-rounder", bats: "Right", bowls: "Right-arm medium", debut: 1991, born: 1969 },
  { name: "Allan Donald", country: "South Africa", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 1991, born: 1966 },
  { name: "Jacques Kallis", country: "South Africa", role: "All-rounder", bats: "Right", bowls: "Right-arm fast-medium", debut: 1995, born: 1975 },
  { name: "Gary Kirsten", country: "South Africa", role: "Batsman", bats: "Left", bowls: "None", debut: 1993, born: 1967 },
  { name: "Jonty Rhodes", country: "South Africa", role: "Batsman", bats: "Right", bowls: "Right-arm medium", debut: 1992, born: 1969 },
  { name: "Shaun Pollock", country: "South Africa", role: "All-rounder", bats: "Right", bowls: "Right-arm fast-medium", debut: 1995, born: 1973 },
  { name: "Mark Boucher", country: "South Africa", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 1997, born: 1976 },
  { name: "Herschelle Gibbs", country: "South Africa", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 1996, born: 1974 },
  { name: "Makhaya Ntini", country: "South Africa", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 1998, born: 1977 },
  { name: "Graeme Smith", country: "South Africa", role: "Batsman", bats: "Left", bowls: "Right-arm off break", debut: 2002, born: 1981 },
  { name: "AB de Villiers", country: "South Africa", role: "Batsman", bats: "Right", bowls: "Right-arm medium", debut: 2004, born: 1984 },
  { name: "Dale Steyn", country: "South Africa", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2004, born: 1984 },
  { name: "Hashim Amla", country: "South Africa", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2004, born: 1983 },
  { name: "Faf du Plessis", country: "South Africa", role: "Batsman", bats: "Right", bowls: "Right-arm leg break", debut: 2012, born: 1984 },
  { name: "Vernon Philander", country: "South Africa", role: "Bowler", bats: "Right", bowls: "Right-arm fast-medium", debut: 2011, born: 1985 },
  { name: "Morne Morkel", country: "South Africa", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2006, born: 1984 },

  // ===== NEW ZEALAND (29) =====
  { name: "Kane Williamson", country: "New Zealand", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2010, born: 1990 },
  { name: "Trent Boult", country: "New Zealand", role: "Bowler", bats: "Right", bowls: "Left-arm fast-medium", debut: 2011, born: 1989 },
  { name: "Devon Conway", country: "New Zealand", role: "WK-Batsman", bats: "Left", bowls: "None", debut: 2020, born: 1991 },
  { name: "Rachin Ravindra", country: "New Zealand", role: "All-rounder", bats: "Left", bowls: "Left-arm orthodox", debut: 2020, born: 1999 },
  { name: "Tim Southee", country: "New Zealand", role: "Bowler", bats: "Right", bowls: "Right-arm fast-medium", debut: 2008, born: 1988 },
  { name: "Lockie Ferguson", country: "New Zealand", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2016, born: 1991 },
  { name: "Daryl Mitchell", country: "New Zealand", role: "All-rounder", bats: "Right", bowls: "Right-arm medium", debut: 2019, born: 1991 },
  { name: "Matt Henry", country: "New Zealand", role: "Bowler", bats: "Right", bowls: "Right-arm fast-medium", debut: 2013, born: 1991 },
  { name: "Glenn Phillips", country: "New Zealand", role: "WK-Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2016, born: 1996 },
  { name: "Mitchell Santner", country: "New Zealand", role: "All-rounder", bats: "Left", bowls: "Left-arm orthodox", debut: 2015, born: 1992 },
  { name: "Tom Latham", country: "New Zealand", role: "WK-Batsman", bats: "Left", bowls: "None", debut: 2012, born: 1992 },
  { name: "Finn Allen", country: "New Zealand", role: "Batsman", bats: "Right", bowls: "None", debut: 2020, born: 1999 },
  { name: "Will Young", country: "New Zealand", role: "Batsman", bats: "Left", bowls: "None", debut: 2020, born: 1992 },
  { name: "Ish Sodhi", country: "New Zealand", role: "Bowler", bats: "Right", bowls: "Right-arm leg break", debut: 2013, born: 1992 },
  { name: "Kyle Jamieson", country: "New Zealand", role: "Bowler", bats: "Right", bowls: "Right-arm fast-medium", debut: 2020, born: 1994 },
  { name: "James Neesham", country: "New Zealand", role: "All-rounder", bats: "Left", bowls: "Right-arm medium", debut: 2013, born: 1990 },
  { name: "Richard Hadlee", country: "New Zealand", role: "Bowler", bats: "Right", bowls: "Right-arm fast-medium", debut: 1973, born: 1951 },
  { name: "Martin Crowe", country: "New Zealand", role: "Batsman", bats: "Right", bowls: "Right-arm medium", debut: 1982, born: 1962 },
  { name: "John Wright", country: "New Zealand", role: "Batsman", bats: "Left", bowls: "None", debut: 1978, born: 1954 },
  { name: "Stephen Fleming", country: "New Zealand", role: "Batsman", bats: "Left", bowls: "None", debut: 1994, born: 1973 },
  { name: "Chris Cairns", country: "New Zealand", role: "All-rounder", bats: "Right", bowls: "Right-arm fast-medium", debut: 1989, born: 1970 },
  { name: "Daniel Vettori", country: "New Zealand", role: "Bowler", bats: "Left", bowls: "Left-arm orthodox", debut: 1997, born: 1979 },
  { name: "Nathan Astle", country: "New Zealand", role: "Batsman", bats: "Right", bowls: "Right-arm medium", debut: 1995, born: 1971 },
  { name: "Brendon McCullum", country: "New Zealand", role: "WK-Batsman", bats: "Right", bowls: "Right-arm medium", debut: 2002, born: 1981 },
  { name: "Ross Taylor", country: "New Zealand", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2006, born: 1984 },
  { name: "Martin Guptill", country: "New Zealand", role: "Batsman", bats: "Right", bowls: "Right-arm medium", debut: 2009, born: 1986 },
  { name: "Neil Wagner", country: "New Zealand", role: "Bowler", bats: "Left", bowls: "Left-arm fast-medium", debut: 2012, born: 1986 },
  { name: "BJ Watling", country: "New Zealand", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 2009, born: 1985 },
  { name: "Shane Bond", country: "New Zealand", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2001, born: 1975 },

  // ===== SRI LANKA (28) =====
  { name: "Wanindu Hasaranga", country: "Sri Lanka", role: "All-rounder", bats: "Right", bowls: "Right-arm leg break", debut: 2017, born: 1997 },
  { name: "Matheesha Pathirana", country: "Sri Lanka", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2022, born: 2002 },
  { name: "Kusal Mendis", country: "Sri Lanka", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 2015, born: 1995 },
  { name: "Dasun Shanaka", country: "Sri Lanka", role: "All-rounder", bats: "Right", bowls: "Right-arm medium", debut: 2013, born: 1991 },
  { name: "Pathum Nissanka", country: "Sri Lanka", role: "Batsman", bats: "Right", bowls: "None", debut: 2021, born: 1997 },
  { name: "Dushmantha Chameera", country: "Sri Lanka", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2014, born: 1993 },
  { name: "Charith Asalanka", country: "Sri Lanka", role: "Batsman", bats: "Left", bowls: "Right-arm off break", debut: 2021, born: 1997 },
  { name: "Kusal Perera", country: "Sri Lanka", role: "WK-Batsman", bats: "Left", bowls: "None", debut: 2011, born: 1990 },
  { name: "Dhananjaya de Silva", country: "Sri Lanka", role: "All-rounder", bats: "Right", bowls: "Right-arm off break", debut: 2013, born: 1991 },
  { name: "Maheesh Theekshana", country: "Sri Lanka", role: "Bowler", bats: "Right", bowls: "Right-arm off break", debut: 2021, born: 2001 },
  { name: "Dilshan Madushanka", country: "Sri Lanka", role: "Bowler", bats: "Left", bowls: "Left-arm fast", debut: 2023, born: 2001 },
  { name: "Angelo Mathews", country: "Sri Lanka", role: "All-rounder", bats: "Right", bowls: "Right-arm medium", debut: 2008, born: 1987 },
  { name: "Avishka Fernando", country: "Sri Lanka", role: "Batsman", bats: "Right", bowls: "None", debut: 2018, born: 1998 },
  { name: "Nuwan Thushara", country: "Sri Lanka", role: "Bowler", bats: "Left", bowls: "Left-arm fast", debut: 2023, born: 1994 },
  { name: "Arjuna Ranatunga", country: "Sri Lanka", role: "Batsman", bats: "Left", bowls: "Right-arm medium", debut: 1982, born: 1963 },
  { name: "Sanath Jayasuriya", country: "Sri Lanka", role: "All-rounder", bats: "Left", bowls: "Left-arm orthodox", debut: 1989, born: 1969 },
  { name: "Aravinda de Silva", country: "Sri Lanka", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 1984, born: 1965 },
  { name: "Muttiah Muralitharan", country: "Sri Lanka", role: "Bowler", bats: "Right", bowls: "Right-arm off break", debut: 1992, born: 1972 },
  { name: "Mahela Jayawardene", country: "Sri Lanka", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 1997, born: 1977 },
  { name: "Kumar Sangakkara", country: "Sri Lanka", role: "WK-Batsman", bats: "Left", bowls: "None", debut: 2000, born: 1977 },
  { name: "Chaminda Vaas", country: "Sri Lanka", role: "Bowler", bats: "Left", bowls: "Left-arm fast-medium", debut: 1994, born: 1974 },
  { name: "Tillakaratne Dilshan", country: "Sri Lanka", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 1999, born: 1976 },
  { name: "Lasith Malinga", country: "Sri Lanka", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2004, born: 1983 },
  { name: "Upul Tharanga", country: "Sri Lanka", role: "Batsman", bats: "Left", bowls: "None", debut: 2005, born: 1985 },
  { name: "Rangana Herath", country: "Sri Lanka", role: "Bowler", bats: "Left", bowls: "Left-arm orthodox", debut: 1999, born: 1978 },
  { name: "Marvan Atapattu", country: "Sri Lanka", role: "Batsman", bats: "Right", bowls: "None", debut: 1990, born: 1970 },
  { name: "Roshan Mahanama", country: "Sri Lanka", role: "Batsman", bats: "Right", bowls: "None", debut: 1986, born: 1966 },
  { name: "Nuwan Kulasekara", country: "Sri Lanka", role: "Bowler", bats: "Left", bowls: "Right-arm fast-medium", debut: 2004, born: 1982 },

  // ===== BANGLADESH (22) =====
  { name: "Shakib Al Hasan", country: "Bangladesh", role: "All-rounder", bats: "Left", bowls: "Left-arm orthodox", debut: 2006, born: 1987 },
  { name: "Litton Das", country: "Bangladesh", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 2015, born: 1994 },
  { name: "Mustafizur Rahman", country: "Bangladesh", role: "Bowler", bats: "Left", bowls: "Left-arm fast-medium", debut: 2015, born: 1995 },
  { name: "Najmul Hossain Shanto", country: "Bangladesh", role: "Batsman", bats: "Left", bowls: "None", debut: 2018, born: 1998 },
  { name: "Taskin Ahmed", country: "Bangladesh", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2014, born: 1995 },
  { name: "Mehidy Hasan Miraz", country: "Bangladesh", role: "All-rounder", bats: "Right", bowls: "Right-arm off break", debut: 2016, born: 1997 },
  { name: "Towhid Hridoy", country: "Bangladesh", role: "Batsman", bats: "Right", bowls: "None", debut: 2023, born: 2002 },
  { name: "Shoriful Islam", country: "Bangladesh", role: "Bowler", bats: "Left", bowls: "Left-arm fast", debut: 2020, born: 2000 },
  { name: "Tanzid Hasan", country: "Bangladesh", role: "Batsman", bats: "Left", bowls: "None", debut: 2023, born: 2001 },
  { name: "Nasum Ahmed", country: "Bangladesh", role: "Bowler", bats: "Left", bowls: "Left-arm orthodox", debut: 2020, born: 1995 },
  { name: "Mahmudullah", country: "Bangladesh", role: "All-rounder", bats: "Right", bowls: "Right-arm off break", debut: 2007, born: 1986 },
  { name: "Tanzim Hasan Sakib", country: "Bangladesh", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2023, born: 2001 },
  { name: "Mashrafe Mortaza", country: "Bangladesh", role: "Bowler", bats: "Right", bowls: "Right-arm fast-medium", debut: 2001, born: 1983 },
  { name: "Tamim Iqbal", country: "Bangladesh", role: "Batsman", bats: "Left", bowls: "None", debut: 2007, born: 1989 },
  { name: "Habibul Bashar", country: "Bangladesh", role: "Batsman", bats: "Right", bowls: "None", debut: 1995, born: 1972 },
  { name: "Mohammad Ashraful", country: "Bangladesh", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2001, born: 1984 },
  { name: "Abdur Razzak", country: "Bangladesh", role: "Bowler", bats: "Left", bowls: "Left-arm orthodox", debut: 2004, born: 1982 },
  { name: "Khaled Mahmud", country: "Bangladesh", role: "All-rounder", bats: "Right", bowls: "Right-arm medium", debut: 1997, born: 1970 },
  { name: "Aminul Islam", country: "Bangladesh", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 1995, born: 1968 },
  { name: "Rubel Hossain", country: "Bangladesh", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2009, born: 1990 },
  { name: "Imrul Kayes", country: "Bangladesh", role: "Batsman", bats: "Left", bowls: "None", debut: 2008, born: 1987 },
  { name: "Al-Amin Hossain", country: "Bangladesh", role: "Bowler", bats: "Right", bowls: "Right-arm fast-medium", debut: 2013, born: 1990 },

  // ===== AFGHANISTAN (17) =====
  { name: "Rashid Khan", country: "Afghanistan", role: "Bowler", bats: "Right", bowls: "Right-arm leg break", debut: 2015, born: 1998 },
  { name: "Mohammad Nabi", country: "Afghanistan", role: "All-rounder", bats: "Right", bowls: "Right-arm off break", debut: 2009, born: 1985 },
  { name: "Rahmanullah Gurbaz", country: "Afghanistan", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 2018, born: 2001 },
  { name: "Fazalhaq Farooqi", country: "Afghanistan", role: "Bowler", bats: "Left", bowls: "Left-arm fast-medium", debut: 2021, born: 2001 },
  { name: "Noor Ahmad", country: "Afghanistan", role: "Bowler", bats: "Left", bowls: "Left-arm wrist spin", debut: 2022, born: 2003 },
  { name: "Ibrahim Zadran", country: "Afghanistan", role: "Batsman", bats: "Right", bowls: "None", debut: 2021, born: 2001 },
  { name: "Azmatullah Omarzai", country: "Afghanistan", role: "All-rounder", bats: "Right", bowls: "Right-arm medium-fast", debut: 2021, born: 2000 },
  { name: "Naveen-ul-Haq", country: "Afghanistan", role: "Bowler", bats: "Right", bowls: "Right-arm fast-medium", debut: 2017, born: 1999 },
  { name: "Gulbadin Naib", country: "Afghanistan", role: "All-rounder", bats: "Right", bowls: "Right-arm medium", debut: 2013, born: 1991 },
  { name: "Rahmat Shah", country: "Afghanistan", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2015, born: 1993 },
  { name: "Asghar Afghan", country: "Afghanistan", role: "Batsman", bats: "Right", bowls: "Right-arm medium", debut: 2009, born: 1987 },
  { name: "Hamid Hassan", country: "Afghanistan", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2009, born: 1987 },
  { name: "Shapoor Zadran", country: "Afghanistan", role: "Bowler", bats: "Left", bowls: "Left-arm fast", debut: 2009, born: 1987 },
  { name: "Karim Janat", country: "Afghanistan", role: "All-rounder", bats: "Right", bowls: "Right-arm medium", debut: 2015, born: 1993 },
  { name: "Najibullah Zadran", country: "Afghanistan", role: "Batsman", bats: "Left", bowls: "None", debut: 2013, born: 1993 },
  { name: "Mujeeb Ur Rahman", country: "Afghanistan", role: "Bowler", bats: "Right", bowls: "Right-arm off break", debut: 2018, born: 2001 },
  { name: "Hashmatullah Shahidi", country: "Afghanistan", role: "Batsman", bats: "Left", bowls: "None", debut: 2013, born: 1994 },

  // ===== WEST INDIES (32) =====
  { name: "Nicholas Pooran", country: "West Indies", role: "WK-Batsman", bats: "Left", bowls: "None", debut: 2016, born: 1995 },
  { name: "Shimron Hetmyer", country: "West Indies", role: "Batsman", bats: "Left", bowls: "None", debut: 2017, born: 1996 },
  { name: "Andre Russell", country: "West Indies", role: "All-rounder", bats: "Right", bowls: "Right-arm fast", debut: 2010, born: 1988 },
  { name: "Sunil Narine", country: "West Indies", role: "Bowler", bats: "Left", bowls: "Right-arm off break", debut: 2011, born: 1988 },
  { name: "Alzarri Joseph", country: "West Indies", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 2016, born: 1996 },
  { name: "Shai Hope", country: "West Indies", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 2015, born: 1993 },
  { name: "Kyle Mayers", country: "West Indies", role: "All-rounder", bats: "Left", bowls: "Right-arm medium", debut: 2021, born: 1992 },
  { name: "Jason Holder", country: "West Indies", role: "All-rounder", bats: "Right", bowls: "Right-arm fast-medium", debut: 2013, born: 1991 },
  { name: "Roston Chase", country: "West Indies", role: "All-rounder", bats: "Right", bowls: "Right-arm off break", debut: 2014, born: 1992 },
  { name: "Akeal Hosein", country: "West Indies", role: "Bowler", bats: "Left", bowls: "Left-arm orthodox", debut: 2019, born: 1993 },
  { name: "Romario Shepherd", country: "West Indies", role: "All-rounder", bats: "Right", bowls: "Right-arm fast-medium", debut: 2021, born: 1994 },
  { name: "Brandon King", country: "West Indies", role: "Batsman", bats: "Right", bowls: "None", debut: 2019, born: 1995 },
  { name: "Gudakesh Motie", country: "West Indies", role: "Bowler", bats: "Left", bowls: "Left-arm orthodox", debut: 2019, born: 1996 },
  { name: "Obed McCoy", country: "West Indies", role: "Bowler", bats: "Left", bowls: "Left-arm fast-medium", debut: 2019, born: 1998 },
  { name: "Viv Richards", country: "West Indies", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 1974, born: 1952 },
  { name: "Clive Lloyd", country: "West Indies", role: "Batsman", bats: "Left", bowls: "Right-arm medium", debut: 1966, born: 1944 },
  { name: "Malcolm Marshall", country: "West Indies", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 1978, born: 1958 },
  { name: "Michael Holding", country: "West Indies", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 1975, born: 1954 },
  { name: "Joel Garner", country: "West Indies", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 1977, born: 1952 },
  { name: "Gordon Greenidge", country: "West Indies", role: "Batsman", bats: "Right", bowls: "None", debut: 1974, born: 1951 },
  { name: "Desmond Haynes", country: "West Indies", role: "Batsman", bats: "Right", bowls: "None", debut: 1978, born: 1956 },
  { name: "Curtly Ambrose", country: "West Indies", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 1988, born: 1963 },
  { name: "Courtney Walsh", country: "West Indies", role: "Bowler", bats: "Right", bowls: "Right-arm fast", debut: 1984, born: 1962 },
  { name: "Brian Lara", country: "West Indies", role: "Batsman", bats: "Left", bowls: "Right-arm leg break", debut: 1990, born: 1969 },
  { name: "Carl Hooper", country: "West Indies", role: "All-rounder", bats: "Right", bowls: "Right-arm off break", debut: 1987, born: 1966 },
  { name: "Shivnarine Chanderpaul", country: "West Indies", role: "Batsman", bats: "Left", bowls: "Right-arm leg break", debut: 1994, born: 1974 },
  { name: "Chris Gayle", country: "West Indies", role: "Batsman", bats: "Left", bowls: "Right-arm off break", debut: 1999, born: 1979 },
  { name: "Ramnaresh Sarwan", country: "West Indies", role: "Batsman", bats: "Right", bowls: "Right-arm off break", debut: 2000, born: 1980 },
  { name: "Dwayne Bravo", country: "West Indies", role: "All-rounder", bats: "Right", bowls: "Right-arm medium-fast", debut: 2004, born: 1983 },
  { name: "Kieron Pollard", country: "West Indies", role: "All-rounder", bats: "Right", bowls: "Right-arm medium", debut: 2007, born: 1987 },
  { name: "Denesh Ramdin", country: "West Indies", role: "WK-Batsman", bats: "Right", bowls: "None", debut: 2005, born: 1985 },
  { name: "Darren Sammy", country: "West Indies", role: "All-rounder", bats: "Right", bowls: "Right-arm medium", debut: 2004, born: 1983 },
];

const MAX_TRIES = 6;
const CONTINENTS = {
  "India": "Asia",
  "Pakistan": "Asia",
  "Sri Lanka": "Asia",
  "Bangladesh": "Asia",
  "Afghanistan": "Asia",
  "Australia": "Oceania",
  "New Zealand": "Oceania",
  "England": "Europe",
  "South Africa": "Africa",
  "West Indies": "Caribbean",
};
const ROLE_GROUPS = {
  "Batsman": ["Batsman", "WK-Batsman", "All-rounder"],
  "WK-Batsman": ["WK-Batsman", "Batsman"],
  "Bowler": ["Bowler", "All-rounder"],
  "All-rounder": ["All-rounder", "Batsman", "Bowler"],
};

// --- Daily puzzle helpers -----------------------------------------
function getISTDateString() {
  const now = new Date();
  const istMs = now.getTime() + (now.getTimezoneOffset() * 60000) + (5.5 * 3600000);
  const ist = new Date(istMs);
  const y = ist.getFullYear();
  const m = String(ist.getMonth() + 1).padStart(2, "0");
  const d = String(ist.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function hashStringToInt(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function msUntilNextISTMidnight() {
  const now = new Date();
  const istMs = now.getTime() + (now.getTimezoneOffset() * 60000) + (5.5 * 3600000);
  const ist = new Date(istMs);
  const next = new Date(ist);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - ist.getTime();
}

function formatCountdown(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function addDaysToISTDateString(dateStr, days) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

// --- localStorage streak helpers (device-only, no backend) --------
// Falls back to an in-memory object if localStorage is unavailable
// (e.g. inside this chat's artifact preview sandbox). Once deployed
// to a real host, localStorage works normally and streaks persist
// across visits on the same browser/device.
const memoryFallback = {};
function readStreak() {
  try {
    const raw = window.localStorage.getItem("stumple_streak_v1");
    return raw ? JSON.parse(raw) : { current: 0, longest: 0, lastWinDate: null };
  } catch (e) {
    return memoryFallback.streak || { current: 0, longest: 0, lastWinDate: null };
  }
}
function writeStreak(data) {
  try {
    window.localStorage.setItem("stumple_streak_v1", JSON.stringify(data));
  } catch (e) {
    memoryFallback.streak = data;
  }
}
function registerDailyWin(dateStr) {
  const data = readStreak();
  if (data.lastWinDate === dateStr) return data;
  const yesterday = addDaysToISTDateString(dateStr, -1);
  const newCurrent = data.lastWinDate === yesterday ? data.current + 1 : 1;
  const next = {
    current: newCurrent,
    longest: Math.max(data.longest, newCurrent),
    lastWinDate: dateStr,
  };
  writeStreak(next);
  return next;
}
function registerDailyLoss(dateStr) {
  const data = readStreak();
  if (data.lastWinDate === dateStr) return data;
  const next = { current: 0, longest: data.longest, lastWinDate: data.lastWinDate };
  writeStreak(next);
  return next;
}

function compareField(field, guessVal, answerVal) {
  if (guessVal === answerVal) return "hit";
  if (field === "country") {
    if (CONTINENTS[guessVal] && CONTINENTS[guessVal] === CONTINENTS[answerVal]) return "close";
    return "miss";
  }
  if (field === "role") {
    const group = ROLE_GROUPS[answerVal] || [];
    if (group.includes(guessVal)) return "close";
    return "miss";
  }
  if (field === "bowls") {
    const guessBowls = guessVal !== "None";
    const ansBowls = answerVal !== "None";
    if (guessBowls && ansBowls) return "close";
    return "miss";
  }
  return "miss";
}

const EMOJI = { hit: "🟩", close: "🟨", miss: "🟥" };

function StatusCell({ value, status, direction }) {
  const bg =
    status === "hit" ? "#2F6B4F" : status === "close" ? "#C9A227" : "#7A2E38";
  return (
    <div
      style={{
        background: bg,
        color: "#F5F0E6",
        borderRadius: 6,
        padding: "10px 8px",
        minWidth: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        textAlign: "center",
        boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.15)",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Oswald', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
        {value}
        {direction === "up" && <span aria-label="higher">↑</span>}
        {direction === "down" && <span aria-label="lower">↓</span>}
      </span>
    </div>
  );
}

export default function Stumple() {
  const [mode, setMode] = useState("daily"); // daily | practice
  const dailyDate = getISTDateString();
  const dailyAnswer = useMemo(
    () => PLAYERS[hashStringToInt(dailyDate) % PLAYERS.length],
    [dailyDate]
  );

  const [practiceAnswer, setPracticeAnswer] = useState(
    () => PLAYERS[Math.floor(Math.random() * PLAYERS.length)]
  );

  const answer = mode === "daily" ? dailyAnswer : practiceAnswer;

  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [status, setStatus] = useState("playing"); // playing | won | lost
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(msUntilNextISTMidnight());
  const [streak, setStreak] = useState(() => readStreak());
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setCountdown(msUntilNextISTMidnight()), 1000);
    return () => clearInterval(t);
  }, []);

  const guessedNames = new Set(guesses.map((g) => g.name));

  const suggestions = useMemo(() => {
    if (!input.trim()) return [];
    const q = input.trim().toLowerCase();
    return PLAYERS.filter(
      (p) => p.name.toLowerCase().includes(q) && !guessedNames.has(p.name)
    ).slice(0, 8);
  }, [input, guesses]);

  function submitGuess(player) {
    if (status !== "playing") return;
    if (!player) return;
    const row = {
      name: player.name,
      country: compareField("country", player.country, answer.country),
      role: compareField("role", player.role, answer.role),
      bats: compareField("bats", player.bats, answer.bats),
      bowls: compareField("bowls", player.bowls, answer.bowls),
      debutStatus: player.debut === answer.debut ? "hit" : "miss",
      debutDir: player.debut === answer.debut ? null : player.debut < answer.debut ? "up" : "down",
      bornStatus: player.born === answer.born ? "hit" : "miss",
      bornDir: player.born === answer.born ? null : player.born < answer.born ? "up" : "down",
      raw: player,
    };
    const next = [...guesses, row];
    setGuesses(next);
    setInput("");
    setShowSuggestions(false);
    setCopied(false);

    if (player.name === answer.name) {
      setStatus("won");
      if (mode === "daily") setStreak(registerDailyWin(dailyDate));
    } else if (next.length >= MAX_TRIES) {
      setStatus("lost");
      if (mode === "daily") setStreak(registerDailyLoss(dailyDate));
    }
  }

  function handleSubmitFromInput() {
    const match = PLAYERS.find(
      (p) => p.name.toLowerCase() === input.trim().toLowerCase() && !guessedNames.has(p.name)
    );
    if (match) submitGuess(match);
  }

  function startPractice() {
    let next = PLAYERS[Math.floor(Math.random() * PLAYERS.length)];
    if (PLAYERS.length > 1) {
      while (mode === "practice" && next.name === practiceAnswer.name) {
        next = PLAYERS[Math.floor(Math.random() * PLAYERS.length)];
      }
    }
    setPracticeAnswer(next);
    setMode("practice");
    setGuesses([]);
    setInput("");
    setStatus("playing");
    setCopied(false);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
  }

  function backToDaily() {
    setMode("daily");
    setGuesses([]);
    setInput("");
    setStatus("playing");
    setCopied(false);
  }

  function shareResult() {
    const lines = guesses.map((g) =>
      [EMOJI[g.country], EMOJI[g.role], EMOJI[g.bats], EMOJI[g.bowls], EMOJI[g.debutStatus], EMOJI[g.bornStatus]].join("")
    );
    const header = `Stumple ${mode === "daily" ? dailyDate : "Practice"} ${status === "won" ? guesses.length : "X"}/${MAX_TRIES}`;
    const streakLine = mode === "daily" ? `🔥 Streak: ${streak.current}` : "";
    const text = [header, ...lines, streakLine].filter(Boolean).join("\n");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  const triesLeft = MAX_TRIES - guesses.length;

  return (
    <div
      style={{
        minHeight: "100%",
        background:
          "radial-gradient(1200px 600px at 50% -10%, #1F5138 0%, #14372A 55%, #0E271E 100%)",
        fontFamily: "'Inter', -apple-system, sans-serif",
        color: "#F5F0E6",
        padding: "28px 16px 60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .stumple-seam {
          position: absolute;
          top: 0; left: 50%;
          width: 2px; height: 100%;
          background: repeating-linear-gradient(to bottom, #F5F0E6 0 8px, transparent 8px 16px);
          opacity: 0.08;
          transform: translateX(-50%);
        }
        .stumple-input:focus { outline: 2px solid #D4AF37; outline-offset: 2px; }
        .stumple-btn:focus-visible { outline: 2px solid #D4AF37; outline-offset: 2px; }
        .stumple-row { animation: stumple-in 0.35s ease; }
        @keyframes stumple-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stumple-tab {
          background: transparent; border: 1px solid #3B6A54; color: #C9BFA8;
          padding: 6px 14px; border-radius: 20px; font-size: 12px; cursor: pointer;
          font-family: 'Oswald', sans-serif; letter-spacing: 1px; text-transform: uppercase;
        }
        .stumple-tab.active { background: #C41E3A; border-color: #C41E3A; color: #F5F0E6; }
      `}</style>

      <div style={{ position: "relative", width: "100%", maxWidth: 640 }}>
        <div className="stumple-seam" />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>🏏</span>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 40, letterSpacing: 2, margin: 0, textTransform: "uppercase" }}>
              Stumple
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "#C9BFA8" }}>
            Guess the cricketer in {MAX_TRIES} tries. Every guess gives you clues.
          </p>
          {streak.current > 0 && (
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#D4AF37", fontFamily: "'Oswald', sans-serif" }}>
              🔥 {streak.current} day streak {streak.longest > streak.current ? `· best ${streak.longest}` : ""}
            </p>
          )}
        </div>

        {/* Mode tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 18 }}>
          <button className={`stumple-tab ${mode === "daily" ? "active" : ""}`} onClick={backToDaily}>
            Daily Puzzle
          </button>
          <button className={`stumple-tab ${mode === "practice" ? "active" : ""}`} onClick={startPractice}>
            Practice
          </button>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 20, flexWrap: "wrap", fontSize: 11, color: "#C9BFA8" }}>
          <span><i style={{ background: "#2F6B4F", display: "inline-block", width: 10, height: 10, borderRadius: 3, marginRight: 5 }} />Correct</span>
          <span><i style={{ background: "#C9A227", display: "inline-block", width: 10, height: 10, borderRadius: 3, marginRight: 5 }} />Close</span>
          <span><i style={{ background: "#7A2E38", display: "inline-block", width: 10, height: 10, borderRadius: 3, marginRight: 5 }} />Wrong</span>
        </div>

        {/* Input */}
        {status === "playing" && (
          <div style={{ position: "relative", marginBottom: 22 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                ref={inputRef}
                className="stumple-input"
                value={input}
                onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmitFromInput(); }}
                placeholder="Type a cricketer's name…"
                style={{ flex: 1, padding: "12px 14px", borderRadius: 8, border: "1px solid #3B6A54", background: "#0E271E", color: "#F5F0E6", fontSize: 15 }}
              />
              <button className="stumple-btn" onClick={handleSubmitFromInput} style={{ background: "#C41E3A", color: "#F5F0E6", border: "none", borderRadius: 8, padding: "0 18px", fontFamily: "'Oswald', sans-serif", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", fontSize: 13, cursor: "pointer" }}>
                Guess
              </button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#183B2C", border: "1px solid #3B6A54", borderRadius: 8, overflow: "hidden", zIndex: 10, maxHeight: 280, overflowY: "auto" }}>
                {suggestions.map((p) => (
                  <div key={p.name} onClick={() => submitGuess(p)} onMouseDown={(e) => e.preventDefault()}
                    style={{ padding: "10px 14px", cursor: "pointer", fontSize: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {p.name} <span style={{ color: "#8FAE9C", fontSize: 12 }}>· {p.country}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Column headers */}
        {guesses.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1.1fr 0.8fr 1.3fr 0.8fr 0.7fr", gap: 6, fontSize: 10, color: "#8FAE9C", textTransform: "uppercase", letterSpacing: 0.5, padding: "0 2px", marginBottom: 6 }}>
            <span>Player</span><span>Country</span><span>Role</span><span>Bats</span><span>Bowls</span><span>Debut</span><span>Born</span>
          </div>
        )}

        {/* Guess rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {guesses.map((g, i) => (
            <div key={i} className="stumple-row" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1.1fr 0.8fr 1.3fr 0.8fr 0.7fr", gap: 6, alignItems: "center" }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 13, paddingRight: 4 }}>{g.name}</div>
              <StatusCell value={g.raw.country} status={g.country} />
              <StatusCell value={g.raw.role} status={g.role} />
              <StatusCell value={g.raw.bats} status={g.bats} />
              <StatusCell value={g.raw.bowls} status={g.bowls} />
              <StatusCell value={g.raw.debut} status={g.debutStatus} direction={g.debutDir} />
              <StatusCell value={g.raw.born} status={g.bornStatus} direction={g.bornDir} />
            </div>
          ))}
        </div>

        {/* Status footer */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          {status === "playing" && guesses.length > 0 && (
            <p style={{ fontSize: 13, color: "#C9BFA8" }}>{triesLeft} {triesLeft === 1 ? "try" : "tries"} left</p>
          )}
          {(status === "won" || status === "lost") && (
            <div>
              <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, color: status === "won" ? "#D4AF37" : "#C9A66B", margin: "0 0 6px" }}>
                {status === "won"
                  ? `Howzat! It was ${answer.name} — solved in ${guesses.length}.`
                  : `Bowled out. It was ${answer.name}.`}
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 10 }}>
                <button className="stumple-btn" onClick={shareResult} style={{ ...newGameBtnStyle, background: "#2F6B4F" }}>
                  {copied ? "Copied!" : "Share Result"}
                </button>
                {mode === "practice" && (
                  <button className="stumple-btn" onClick={startPractice} style={{ ...newGameBtnStyle, background: "#3B6A54" }}>
                    Next Practice Round
                  </button>
                )}
              </div>
              {mode === "daily" && (
                <p style={{ fontSize: 12, color: "#8FAE9C", marginTop: 14 }}>
                  Next daily puzzle in {formatCountdown(countdown)} (IST) — or switch to Practice above to keep playing now.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const newGameBtnStyle = {
  color: "#F5F0E6",
  border: "none",
  borderRadius: 8,
  padding: "10px 22px",
  fontFamily: "'Oswald', sans-serif",
  fontWeight: 600,
  letterSpacing: 1,
  textTransform: "uppercase",
  fontSize: 13,
  cursor: "pointer",
};
