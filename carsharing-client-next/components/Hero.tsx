import Image from 'next/image'
import Button from './Button'


const Hero = () => {
  return (
    <section className='max-container padding-container flex flex-col 
    gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row'>
      <div className='hero-map' />

      <div className='relative z-20 flex flex-1 flex-col xl:w-1/2'>
      <h1 className='bold-52 lg:bold-88'>Ride Together, Commute Better.</h1>
      <p className='regular-16 mt-6 text-gray-30 xl:max-w-[520px]'>Discover seamless carpooling with our web application designed for efficient commuting to work or college. Whether you're a professional seeking a convenient ride to the office or a student in need of reliable transportation, our platform connects you with fellow commuters. Share rides for daily commutes or plan longer journeys effortlessly. Join us in promoting sustainability, reducing traffic, and fostering a community of shared mobility experiences.</p>
      <div className='my-11 flex flex-wrap gap-5'>
        <div className='flex items-center gap-2'>
          {Array(5).fill(1).map((_, index) => (
            <Image src="/star.svg" key={index} alt='star' width={24} height={24} />
          ))}
        </div>
        <p className='bold-16 lg:bold-20 text-blue-70'>
          198k
          <span className='regular-16 lg:regular-20 ml-1'>Excellent Reviews</span>
        </p>
      </div>

      <div className='flex flex-col w-full gap-3 sm:flex-row'>
        <Button type='button' title='Dowload App' variant='btn_green'/>
        <Button type='button' title='How we work?' icon="/play.svg" variant='btn_white_text'/>
      </div>
      </div>

      <div className='relative flex flex-1 items-start'>
        <div className='relative z-20 flex w-[268px] flex-col gap-8 rounded-3xl bg-green-90 px-7 py-8'>
          
          <div className='flex flex-col'>
            <div className='flexBetween'>
              <p className='regular-16 text-gray-20'>Starting point</p>
              <Image src="/close.svg" alt='close' width={24} height={24}/>
            </div>
            <p className='bold-20 text-white'>Seville</p>
            <div className='flexBetween'>
              <p className='regular-16 text-gray-20'>Destination</p>
              <Image src="/close.svg" alt='close' width={24} height={24}/>
            </div>
            <p className='bold-20 text-white'>Madrid</p>
            </div>

            <div className='flexBetween'>
              <div className='flex flex-col'>
                <p className='regular-16 block text-gray-20'>Distance</p>
                <p className='bold-20 text-white'>530 km</p>
              </div>
              <div className='flex flex-col'>
                <p className='regular-16 block text-gray-20'>Duration</p>
                <p className='bold-20 text-white'>5:10 hours</p>
              </div>
            </div>
    
            
        </div>
      </div>
    </section>
  )
}

export default Hero
