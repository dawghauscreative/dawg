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
		<p class="hero__lede"><?php esc_html_e( 'A production company built at the intersection of food, travel, and documentary storytelling — with the independent-vs-homogenized itch built right into the name.', 'independent-lasagna' ); ?></p>
	</div>
</section>

<section class="section section--cream">
	<div class="container split">
		<div class="il-fade">
			<span class="eyebrow"><?php esc_html_e( 'Our Story', 'independent-lasagna' ); ?></span>
			<h2><?php esc_html_e( 'The name is supposed to make you ask a question.', 'independent-lasagna' ); ?></h2>
			<p><?php esc_html_e( 'Independent Lasagna Productions was founded by Reyshan Parker and a crew of fellow SCAD alumni and Savannah locals who got tired of watching every town start to look the same — same restaurants, same hotels, same top-ten lists. We wanted to go find what was left of everything else.', 'independent-lasagna' ); ?></p>
			<p><?php esc_html_e( 'So we make films about the things that haven’t been smoothed out yet: the diner, the roadside stand, the family recipe, the guy who’s run the same bar for thirty years. Food is usually how we get in the door. It’s rarely the whole story.', 'independent-lasagna' ); ?></p>
		</div>
		<blockquote class="card il-fade" style="animation-delay:100ms">
			<?php il_layers_mark(); ?>
			<span class="eyebrow"><?php esc_html_e( 'Our Philosophy', 'independent-lasagna' ); ?></span>
			<h3><?php esc_html_e( 'Every story has layers.', 'independent-lasagna' ); ?></h3>
			<p><?php esc_html_e( 'Lasagna is built one layer at a time. So is a good story. Food is the top layer — the thing you notice first. Underneath it: people, place, history, culture. Our job is to dig through them, then bring back what we found.', 'independent-lasagna' ); ?></p>
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
	<div class="container split">
		<div class="il-fade">
			<span class="eyebrow"><?php esc_html_e( 'Independent, on Purpose', 'independent-lasagna' ); ?></span>
			<h2><?php esc_html_e( 'What survives when every town gets the same everything?', 'independent-lasagna' ); ?></h2>
			<p><?php esc_html_e( 'We’re drawn to independent restaurants, independent farmers, independent makers — the ones still doing it their own way. Not because we’re against progress. Because those are the stories worth telling before they’re gone.', 'independent-lasagna' ); ?></p>
		</div>
		<div class="il-fade" style="animation-delay:100ms">
			<span class="eyebrow"><?php esc_html_e( 'Not Political. Just Curious.', 'independent-lasagna' ); ?></span>
			<h2><?php esc_html_e( 'We just want to know who’s still doing things differently.', 'independent-lasagna' ); ?></h2>
			<p><?php esc_html_e( 'A neighborhood bar can tell you who lives there. A disappearing diner can tell you about a town. A strange regional dish can tell you why two places fifty miles apart grew up nothing alike. We go find out.', 'independent-lasagna' ); ?></p>
		</div>
	</div>
</section>

<section class="section section--cream">
	<div class="container">
		<div class="section-header il-fade">
			<span class="eyebrow"><?php esc_html_e( 'The Crew', 'independent-lasagna' ); ?></span>
			<h2><?php esc_html_e( 'Filmmakers, not tourists.', 'independent-lasagna' ); ?></h2>
		</div>
		<div class="grid grid--3">
			<article class="card il-fade">
				<span class="eyebrow"><?php esc_html_e( 'Founder', 'independent-lasagna' ); ?></span>
				<h3>Reyshan Parker</h3>
				<p><?php esc_html_e( 'Producer / Director / Editor', 'independent-lasagna' ); ?></p>
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
		<h2><?php esc_html_e( 'Have a story with layers? We’d like to go find it.', 'independent-lasagna' ); ?></h2>
		<a class="button button--primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Start a Project', 'independent-lasagna' ); ?></a>
	</div>
</section>

<?php get_footer(); ?>
