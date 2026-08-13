<?php
/**
 * 404 template.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>

<section class="page-hero page-hero--404">
	<div class="container il-fade">
		<span class="eyebrow">404</span>
		<h1><?php esc_html_e( 'This slice went missing.', 'independent-lasagna' ); ?></h1>
		<p class="hero__lede"><?php esc_html_e( 'The page you’re looking for isn’t here. Try the menu, or head back home.', 'independent-lasagna' ); ?></p>
		<div class="button-row">
			<a class="button button--gold" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Back to Home', 'independent-lasagna' ); ?></a>
			<a class="button button--outline" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'See Our Work', 'independent-lasagna' ); ?></a>
		</div>
	</div>
</section>

<?php get_footer(); ?>
