<?php
/**
 * Template Name: About
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();

$founders = array( 'Reyshan Parker', 'Matt Krueger', 'Zach Karamalegos', 'Michael Grayson', 'Josh Hawks', 'Andrew Theodotou', 'Aubrey Fuller' );
?>

<section class="page-hero">
	<div class="container il-fade">
		<span class="eyebrow"><?php esc_html_e( 'About Us', 'independent-lasagna' ); ?></span>
		<h1><?php the_title(); ?></h1>
		<p class="hero__lede"><?php esc_html_e( 'A Multi-Layered Entity, unified around a Do It Together Creative Collective — uniting creatives and businesses of all types for the common good.', 'independent-lasagna' ); ?></p>
	</div>
</section>

<section class="section section--cream">
	<div class="container split">
		<div class="il-fade">
			<span class="eyebrow"><?php esc_html_e( 'Our Story', 'independent-lasagna' ); ?></span>
			<h2><?php esc_html_e( 'Founded to make high-quality content financially feasible.', 'independent-lasagna' ); ?></h2>
			<p><?php esc_html_e( 'Independent Lasagna Productions LLC was founded by Reyshan Parker and a crew of fellow SCAD alumni and Savannah locals, in order to build what they call a Social Production Company.', 'independent-lasagna' ); ?></p>
			<p><?php esc_html_e( 'We specialize in high-quality media content — film and video production, web and graphic design, commercials, wedding documentaries, web series, and feature films. We create original online content and localized media services, covering everything from launch parties to weddings, on any budget.', 'independent-lasagna' ); ?></p>
		</div>
		<blockquote class="card il-fade" style="animation-delay:100ms">
			<span class="eyebrow"><?php esc_html_e( 'Our Philosophy', 'independent-lasagna' ); ?></span>
			<h3><?php esc_html_e( 'Let’s do it together.', 'independent-lasagna' ); ?></h3>
			<p><?php esc_html_e( 'It’s our mission to bring jobs to people with the talent and know-how to create content and media of all forms — helping people pursue their dreams, and in doing so, help others pursue their own.', 'independent-lasagna' ); ?></p>
		</blockquote>
	</div>
</section>

<?php if ( get_the_content() ) : ?>
<section class="section section--dark">
	<div class="container il-fade page-content">
		<?php the_content(); ?>
	</div>
</section>
<?php endif; ?>

<section class="section section--dark">
	<div class="container">
		<div class="section-header il-fade">
			<span class="eyebrow"><?php esc_html_e( 'The Team', 'independent-lasagna' ); ?></span>
			<h2><?php esc_html_e( 'Do It Together, since the start.', 'independent-lasagna' ); ?></h2>
		</div>
		<div class="grid grid--3">
			<article class="card il-fade">
				<span class="eyebrow"><?php esc_html_e( 'Founder', 'independent-lasagna' ); ?></span>
				<h3>Reyshan Parker</h3>
				<p><?php esc_html_e( 'Producer / Creative Director / Editor / Web Designer', 'independent-lasagna' ); ?></p>
			</article>
			<article class="card il-fade" style="animation-delay:70ms">
				<span class="eyebrow"><?php esc_html_e( 'Founding Crew', 'independent-lasagna' ); ?></span>
				<h3><?php esc_html_e( 'SCAD Alumni', 'independent-lasagna' ); ?></h3>
				<p><?php echo esc_html( implode( ', ', array_slice( $founders, 1, 4 ) ) ); ?></p>
			</article>
			<article class="card il-fade" style="animation-delay:140ms">
				<span class="eyebrow"><?php esc_html_e( 'Founding Crew', 'independent-lasagna' ); ?></span>
				<h3><?php esc_html_e( 'Savannah Locals', 'independent-lasagna' ); ?></h3>
				<p><?php echo esc_html( implode( ', ', array_slice( $founders, 5 ) ) ); ?></p>
			</article>
		</div>
	</div>
</section>

<section class="section cta-band">
	<div class="container statement il-fade">
		<h2><?php esc_html_e( 'Want to work with a Do It Together crew?', 'independent-lasagna' ); ?></h2>
		<a class="button button--gold" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Start a Project', 'independent-lasagna' ); ?></a>
	</div>
</section>

<?php get_footer(); ?>
