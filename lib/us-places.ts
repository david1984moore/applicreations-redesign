export type UsState = { code: string; name: string }

export const US_STATES: UsState[] = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'PR', name: 'Puerto Rico' },
]

const STATE_BY_CODE = new Map(US_STATES.map((s) => [s.code, s]))
const STATE_BY_NAME = new Map(US_STATES.map((s) => [s.name.toLowerCase(), s]))

/** city|ST compact rows — capitals plus widely known cities for typeahead. */
const CITY_ROWS = `
Birmingham|AL
Huntsville|AL
Mobile|AL
Montgomery|AL
Tuscaloosa|AL
Anchorage|AK
Fairbanks|AK
Juneau|AK
Phoenix|AZ
Tucson|AZ
Mesa|AZ
Chandler|AZ
Scottsdale|AZ
Gilbert|AZ
Glendale|AZ
Tempe|AZ
Flagstaff|AZ
Little Rock|AR
Fayetteville|AR
Fort Smith|AR
Jonesboro|AR
Los Angeles|CA
San Diego|CA
San Jose|CA
San Francisco|CA
Fresno|CA
Sacramento|CA
Long Beach|CA
Oakland|CA
Bakersfield|CA
Anaheim|CA
Santa Ana|CA
Riverside|CA
Stockton|CA
Irvine|CA
Chula Vista|CA
Fremont|CA
San Bernardino|CA
Modesto|CA
Fontana|CA
Oxnard|CA
Moreno Valley|CA
Huntington Beach|CA
Glendale|CA
Santa Clarita|CA
Garden Grove|CA
Oceanside|CA
Rancho Cucamonga|CA
Santa Rosa|CA
Ontario|CA
Elk Grove|CA
Corona|CA
Lancaster|CA
Palmdale|CA
Salinas|CA
Hayward|CA
Pomona|CA
Escondido|CA
Torrance|CA
Pasadena|CA
Orange|CA
Fullerton|CA
Thousand Oaks|CA
Visalia|CA
Simi Valley|CA
Concord|CA
Roseville|CA
Vallejo|CA
Victorville|CA
Berkeley|CA
Fairfield|CA
Carlsbad|CA
Murrieta|CA
Temecula|CA
Costa Mesa|CA
Ventura|CA
Downey|CA
West Covina|CA
El Monte|CA
Inglewood|CA
Burbank|CA
Richmond|CA
Daly City|CA
San Mateo|CA
Santa Monica|CA
Santa Barbara|CA
Palm Springs|CA
Napa|CA
Monterey|CA
Denver|CO
Colorado Springs|CO
Aurora|CO
Fort Collins|CO
Lakewood|CO
Thornton|CO
Arvada|CO
Westminster|CO
Pueblo|CO
Boulder|CO
Greeley|CO
Centennial|CO
Bridgeport|CT
New Haven|CT
Stamford|CT
Hartford|CT
Waterbury|CT
Norwalk|CT
Danbury|CT
New Britain|CT
Greenwich|CT
Wilmington|DE
Dover|DE
Newark|DE
Middletown|DE
Bear|DE
Washington|DC
Jacksonville|FL
Miami|FL
Tampa|FL
Orlando|FL
St. Petersburg|FL
Hialeah|FL
Port St. Lucie|FL
Cape Coral|FL
Tallahassee|FL
Fort Lauderdale|FL
Pembroke Pines|FL
Hollywood|FL
Miramar|FL
Gainesville|FL
Coral Springs|FL
Clearwater|FL
Palm Bay|FL
Pompano Beach|FL
West Palm Beach|FL
Lakeland|FL
Davie|FL
Miami Gardens|FL
Boca Raton|FL
Deltona|FL
Plantation|FL
Sunrise|FL
Palm Coast|FL
Deerfield Beach|FL
Fort Myers|FL
Melbourne|FL
Largo|FL
Boynton Beach|FL
Kissimmee|FL
Homestead|FL
Sarasota|FL
Pensacola|FL
Key West|FL
Naples|FL
Daytona Beach|FL
Atlanta|GA
Augusta|GA
Columbus|GA
Macon|GA
Savannah|GA
Athens|GA
Sandy Springs|GA
Roswell|GA
Johns Creek|GA
Albany|GA
Honolulu|HI
Pearl City|HI
Hilo|HI
Kailua|HI
Boise|ID
Meridian|ID
Nampa|ID
Idaho Falls|ID
Pocatello|ID
Chicago|IL
Aurora|IL
Joliet|IL
Naperville|IL
Rockford|IL
Springfield|IL
Elgin|IL
Peoria|IL
Champaign|IL
Waukegan|IL
Cicero|IL
Bloomington|IL
Arlington Heights|IL
Evanston|IL
Schaumburg|IL
Bolingbrook|IL
Decatur|IL
Indianapolis|IN
Fort Wayne|IN
Evansville|IN
South Bend|IN
Carmel|IN
Fishers|IN
Bloomington|IN
Hammond|IN
Gary|IN
Lafayette|IN
Des Moines|IA
Cedar Rapids|IA
Davenport|IA
Sioux City|IA
Iowa City|IA
Waterloo|IA
Wichita|KS
Overland Park|KS
Kansas City|KS
Olathe|KS
Topeka|KS
Lawrence|KS
Louisville|KY
Lexington|KY
Bowling Green|KY
Owensboro|KY
Covington|KY
Frankfort|KY
New Orleans|LA
Baton Rouge|LA
Shreveport|LA
Lafayette|LA
Lake Charles|LA
Kenner|LA
Bossier City|LA
Monroe|LA
Portland|ME
Lewiston|ME
Bangor|ME
South Portland|ME
Augusta|ME
Baltimore|MD
Frederick|MD
Rockville|MD
Gaithersburg|MD
Bowie|MD
Annapolis|MD
Hagerstown|MD
Salisbury|MD
Silver Spring|MD
Boston|MA
Worcester|MA
Springfield|MA
Cambridge|MA
Lowell|MA
Brockton|MA
Quincy|MA
Lynn|MA
New Bedford|MA
Fall River|MA
Newton|MA
Lawrence|MA
Somerville|MA
Framingham|MA
Haverhill|MA
Waltham|MA
Malden|MA
Brookline|MA
Plymouth|MA
Salem|MA
Detroit|MI
Grand Rapids|MI
Warren|MI
Sterling Heights|MI
Ann Arbor|MI
Lansing|MI
Dearborn|MI
Clinton Township|MI
Livonia|MI
Troy|MI
Westland|MI
Farmington Hills|MI
Flint|MI
Southfield|MI
Kalamazoo|MI
Wyoming|MI
Rochester Hills|MI
Minneapolis|MN
St. Paul|MN
Rochester|MN
Duluth|MN
Bloomington|MN
Brooklyn Park|MN
Plymouth|MN
Woodbury|MN
Maple Grove|MN
St. Cloud|MN
Jackson|MS
Gulfport|MS
Southaven|MS
Hattiesburg|MS
Biloxi|MS
Kansas City|MO
St. Louis|MO
Springfield|MO
Columbia|MO
Independence|MO
Lee's Summit|MO
O'Fallon|MO
St. Joseph|MO
St. Charles|MO
Jefferson City|MO
Billings|MT
Missoula|MT
Great Falls|MT
Bozeman|MT
Helena|MT
Omaha|NE
Lincoln|NE
Bellevue|NE
Grand Island|NE
Las Vegas|NV
Henderson|NV
Reno|NV
North Las Vegas|NV
Sparks|NV
Carson City|NV
Manchester|NH
Nashua|NH
Concord|NH
Dover|NH
Rochester|NH
Newark|NJ
Jersey City|NJ
Paterson|NJ
Elizabeth|NJ
Lakewood|NJ
Edison|NJ
Woodbridge|NJ
Toms River|NJ
Hamilton|NJ
Trenton|NJ
Clifton|NJ
Camden|NJ
Brick|NJ
Cherry Hill|NJ
Passaic|NJ
Union City|NJ
Bayonne|NJ
East Orange|NJ
Vineland|NJ
New Brunswick|NJ
Hoboken|NJ
Princeton|NJ
Atlantic City|NJ
Albuquerque|NM
Las Cruces|NM
Rio Rancho|NM
Santa Fe|NM
Roswell|NM
New York|NY
Buffalo|NY
Rochester|NY
Yonkers|NY
Syracuse|NY
Albany|NY
New Rochelle|NY
Mount Vernon|NY
Schenectady|NY
Utica|NY
White Plains|NY
Hempstead|NY
Troy|NY
Niagara Falls|NY
Binghamton|NY
Ithaca|NY
Poughkeepsie|NY
Brooklyn|NY
Queens|NY
Bronx|NY
Staten Island|NY
Manhattan|NY
Charlotte|NC
Raleigh|NC
Greensboro|NC
Durham|NC
Winston-Salem|NC
Fayetteville|NC
Cary|NC
Wilmington|NC
High Point|NC
Concord|NC
Asheville|NC
Gastonia|NC
Jacksonville|NC
Chapel Hill|NC
Fargo|ND
Bismarck|ND
Grand Forks|ND
Minot|ND
Columbus|OH
Cleveland|OH
Cincinnati|OH
Toledo|OH
Akron|OH
Dayton|OH
Parma|OH
Canton|OH
Youngstown|OH
Lorain|OH
Hamilton|OH
Springfield|OH
Kettering|OH
Elyria|OH
Oklahoma City|OK
Tulsa|OK
Norman|OK
Broken Arrow|OK
Edmond|OK
Lawton|OK
Portland|OR
Salem|OR
Eugene|OR
Gresham|OR
Hillsboro|OR
Bend|OR
Beaverton|OR
Medford|OR
Springfield|OR
Corvallis|OR
Philadelphia|PA
Pittsburgh|PA
Allentown|PA
Reading|PA
Scranton|PA
Erie|PA
Bethlehem|PA
Lancaster|PA
Harrisburg|PA
Altoona|PA
York|PA
State College|PA
Wilkes-Barre|PA
Chester|PA
Providence|RI
Cranston|RI
Warwick|RI
Pawtucket|RI
East Providence|RI
Newport|RI
Charleston|SC
Columbia|SC
North Charleston|SC
Mount Pleasant|SC
Rock Hill|SC
Greenville|SC
Summerville|SC
Sumter|SC
Hilton Head Island|SC
Myrtle Beach|SC
Sioux Falls|SD
Rapid City|SD
Aberdeen|SD
Pierre|SD
Nashville|TN
Memphis|TN
Knoxville|TN
Chattanooga|TN
Clarksville|TN
Murfreesboro|TN
Franklin|TN
Jackson|TN
Johnson City|TN
Houston|TX
San Antonio|TX
Dallas|TX
Austin|TX
Fort Worth|TX
El Paso|TX
Arlington|TX
Corpus Christi|TX
Plano|TX
Laredo|TX
Lubbock|TX
Garland|TX
Irving|TX
Amarillo|TX
Grand Prairie|TX
Brownsville|TX
McKinney|TX
Frisco|TX
Pasadena|TX
Mesquite|TX
Killeen|TX
McAllen|TX
Waco|TX
Carrollton|TX
Midland|TX
Denton|TX
Abilene|TX
Beaumont|TX
Odessa|TX
Round Rock|TX
Richardson|TX
Tyler|TX
Lewisville|TX
College Station|TX
Pearland|TX
College Station|TX
The Woodlands|TX
Galveston|TX
Salt Lake City|UT
West Valley City|UT
Provo|UT
West Jordan|UT
Orem|UT
Sandy|UT
Ogden|UT
St. George|UT
Layton|UT
South Jordan|UT
Burlington|VT
Essex|VT
South Burlington|VT
Rutland|VT
Montpelier|VT
Virginia Beach|VA
Chesapeake|VA
Norfolk|VA
Richmond|VA
Newport News|VA
Alexandria|VA
Hampton|VA
Roanoke|VA
Portsmouth|VA
Suffolk|VA
Lynchburg|VA
Harrisonburg|VA
Leesburg|VA
Charlottesville|VA
Arlington|VA
Seattle|WA
Spokane|WA
Tacoma|WA
Vancouver|WA
Bellevue|WA
Kent|WA
Everett|WA
Renton|WA
Spokane Valley|WA
Federal Way|WA
Yakima|WA
Bellingham|WA
Kirkland|WA
Kennewick|WA
Auburn|WA
Pasco|WA
Redmond|WA
Olympia|WA
Charleston|WV
Huntington|WV
Morgantown|WV
Parkersburg|WV
Wheeling|WV
Milwaukee|WI
Madison|WI
Green Bay|WI
Kenosha|WI
Racine|WI
Appleton|WI
Waukesha|WI
Eau Claire|WI
Oshkosh|WI
Janesville|WI
Cheyenne|WY
Casper|WY
Laramie|WY
Gillette|WY
Jackson|WY
San Juan|PR
Bayamon|PR
Carolina|PR
Ponce|PR
Caguas|PR
`

export type UsCity = { name: string; state: string }

export const US_CITIES: UsCity[] = CITY_ROWS.trim()
  .split('\n')
  .map((row) => {
    const [name, state] = row.split('|')
    return { name: name ?? '', state: state ?? '' }
  })
  .filter((row) => row.name && row.state)

export function matchUsState(value: string): UsState | undefined {
  const t = value.trim()
  if (!t) return undefined
  const upper = t.toUpperCase()
  if (upper.length === 2) return STATE_BY_CODE.get(upper)
  return STATE_BY_NAME.get(t.toLowerCase())
}

export function usStateName(value: string): string {
  return matchUsState(value)?.name ?? value.trim()
}

export function usStateCode(value: string): string | undefined {
  return matchUsState(value)?.code
}
