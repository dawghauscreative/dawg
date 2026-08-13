<?php
/**
 * Header template.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="skip-link screen-reader-text" href="#site-main"><?php esc_html_e( 'Skip to content', 'independent-lasagna' ); ?></a>

<header class="site-header" id="site-header">
	<div class="container site-header__row">

		<a class="site-branding" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<?php if ( has_custom_logo() ) : ?>
				<?php the_custom_logo(); ?>
			<?php else : ?>
				<span class="site-branding__wordmark">Independent<em>Lasagna</em></span>
			<?php endif; ?>
		</a>

		<nav class="site-nav" id="site-nav" aria-label="<?php esc_attr_e( 'Primary', 'independent-lasagna' ); ?>">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'menu_class'     => 'site-nav__list',
					'fallback_cb'    => 'il_primary_menu_fallback',
					'depth'          => 2,
				)
			);
			?>
		</nav>

		<a class="button button--gold site-header__cta" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">
			<?php esc_html_e( 'Start a Project', 'independent-lasagna' ); ?>
		</a>

		<button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="site-nav">
			<span class="screen-reader-text"><?php esc_html_e( 'Menu', 'independent-lasagna' ); ?></span>
			<span class="nav-toggle__bar"></span>
			<span class="nav-toggle__bar"></span>
			<span class="nav-toggle__bar"></span>
		</button>

	</div>
</header>

<?php
/**
 * Fallback nav if no "Primary Menu" has been assigned in Appearance → Menus.
 */
function il_primary_menu_fallback() {
	$items = array(
		'Home'     => home_url( '/' ),
		'Services' => home_url( '/services/' ),
		'Work'     => home_url( '/work/' ),
		'About'    => home_url( '/about/' ),
		'News'     => home_url( '/news/' ),
		'Contact'  => home_url( '/contact/' ),
	);
	echo '<ul class="site-nav__list">';
	foreach ( $items as $label => $url ) {
		printf( '<li><a href="%1$s">%2$s</a></li>', esc_url( $url ), esc_html( $label ) );
	}
	echo '</ul>';
}
?>

<main id="site-main" class="site-main">
